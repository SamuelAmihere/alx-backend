#!/usr/bin/env python3
"""
LFU Caching:
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """LFU cache system"""

    def __init__(self):
        """Constructor"""
        super().__init__()
        self.keys = []
        self.freq = {}

    def put(self, key, item):
        """
        Add an item in the cache system.
        """
        if key is None or item is None:
            return
        if key in self.cache_data:
            self.cache_data[key] = item
            self.freq[key] += 1
            return
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            discard = self.keys.pop(0)
            del self.cache_data[discard]
            del self.freq[discard]
            print("DISCARD: {}".format(discard))
        self.cache_data[key] = item
        self.freq[key] = 1
        self.keys.append(key)

    def get(self, key):
        """
        Get an item by key.
        """
        if key is None or key not in self.cache_data:
            return None
        self.freq[key] += 1
        self.keys.remove(key)
        self.keys.append(key)
        return self.cache_data[key]
