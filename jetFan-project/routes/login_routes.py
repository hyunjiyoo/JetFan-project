from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

from . import Base_url
global base_url
base_url = Base_url.go_url


class Login(MethodView):
    def get(self):
        return render_template('login.html')