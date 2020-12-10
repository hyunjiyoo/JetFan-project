from flask.views import MethodView
from flask import render_template

import requests
import json

# 안전점검 
class Safety(MethodView):
	def get(self):

		return render_template('inspection.html', data='')
