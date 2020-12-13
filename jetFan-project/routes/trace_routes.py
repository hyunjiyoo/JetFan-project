from flask.views import MethodView
from flask import render_template, request

import requests
import json

# 추적도면 route
class Trace(MethodView):
	def get(self):
		if request.method == 'GET':
			r = requests.get('http://api.jetfan.ga:5000/division')
			dept = json.loads(r.text)

			r = requests.get('http://api.jetfan.ga:5000/tunnel')
			tunnel = json.loads(r.text)

			r = requests.get('http://api.jetfan.ga:5000/jetfan')
			jetfan = json.loads(r.text)

			data = {'dept': dept,
					'tunnel': tunnel,
					'jetfan': jetfan}

			return render_template('trace.html', data=data)
	
	def post(self):
		if request.method == 'POST':
			value = request.get_json()

			r = requests.get('http://api.jetfan.ga:5000/branch')
			branches = json.loads(r.text)

			branch = []
			for item in branches:
				if(item['bran_div_code'] == int(value['div_code'])):
					branch.append(item['bran_name'])
			
			data = {'branch': str(branch)}
			return str(branch)
			# return render_template('trace.html', data=data)
	

# class Trace(MethodView):
# 	def post(self):
# 		value = request
#         return value



class Trace2(MethodView):
	def get(self):
		return render_template('test.html', credit='')