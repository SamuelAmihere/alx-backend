#!/usr/bin/env python3
"""
Basic Babel: Internationalization in Flask
Create a get_locale function with the babel.localeselector
"""
from flask_babel import Babel
from flask import Flask, render_template, request


class Config:
    """
    Config class
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object('1-app.Config')
babel = Babel(app)
app.url_map.strict_slashes = False

@babel.localeselector
def get_locale():
    """
    get locale
    """
    return request.accept_languages\
        .best_match(app.config['LANGUAGES'])


@app.route('/', methods=['GET'])
def home():
    """
    home page
    """
    return render_template('1-index.html')


if __name__ == '__main__':
    app.debug = True
    app.run(host="localhost", port=5000)
