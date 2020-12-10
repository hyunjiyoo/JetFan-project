from flask.views import MethodView
from flask import render_template

import requests
import json

# 이상발생보고서 
class Error(MethodView):
	def get(self):

		return render_template('abnormal.html', data='')

