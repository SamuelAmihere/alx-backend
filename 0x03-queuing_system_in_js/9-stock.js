import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { id: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { id: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { id: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

function getItemById(id) {
  return listProducts.find((item) => item.itemId === id);
}

async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : 0;
}

const app = express();

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const item = getItemById(parseInt(req.params.itemId, 10));
  if (!item) {
    return res.json({ status: 'Product not found' });
  }
  const currentQuantity = await getCurrentReservedStockById(item.itemId);
  res.json({ ...item, currentQuantity });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const item = getItemById(parseInt(req.params.itemId, 10));
  if (!item) {
    return res.json({ status: 'Product not found' });
  }
  const currentQuantity = await getCurrentReservedStockById(item.itemId);
  if (currentQuantity < 1) {
    return res.json({ status: 'Not enough stock available', itemId: item.itemId });
  }
  await reserveStockById(item.itemId, currentQuantity - 1);
  res.json({ status: 'Reservation confirmed', itemId: item.itemId });
});

app.listen(1245, () => {
  console.log('Server running on port 1245');
});