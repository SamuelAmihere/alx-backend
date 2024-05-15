#!/usr/bin/env python3
"""
Create a single / route
"""
from flask import Flask, render_template


app = Flask(__name__)


@app.route('/', methods=['GET'])
def home():
    """
    home page
    """
    return render_template('0-index.html')


if __name__ == '__main__':
    app.debug = True
    app.run(host="localhost", port=5000)
