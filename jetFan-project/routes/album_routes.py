from flask.views import MethodView
from flask import render_template

import requests
import json

# 사진첩 
class Album(MethodView):
	def get(self):

		return render_template('photo.html', data='')

