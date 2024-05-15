#!/usr/bin/env python3
"""
Basic Babel: Internationalization in Flask
"""
from flask import Flask, render_template
from flask_babel import Babel


class Config:
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
babel = Babel(app)
app.config.from_object('1-app.Config')
app.url_map.strict_slashes = False


@app.route('/', methods=['GET'])
def home():
    """
    home page
    """
    return render_template('0-index.html')


if __name__ == '__main__':
    app.debug = True
    app.run(host="localhost", port=5000)
