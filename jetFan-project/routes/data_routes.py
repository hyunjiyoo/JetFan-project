from flask.views import MethodView
from flask import render_template

import requests
import json

# 데이터생성 
class Data(MethodView):
	def get(self):

		return render_template('createData.html', data='')

