from flask.views import MethodView
from flask import render_template, request

import requests
import json

# 추적도면 route
class Trace(MethodView):
	def get(self):
		if request.method == 'GET':
			r = requests.get('http://api.jetfan.ga:5007/division')
			depts = json.loads(r.text)
			return render_template('trace.html', depts=depts)
	
	def post(self):
		if request.method == 'POST':
			dataArr = []
			value = request.get_json()

			if(value['div'] == 'branch'):
				r = requests.get('http://api.jetfan.ga:5007/branch')
				branch = json.loads(r.text)

				for item in branch:
					if(item['bran_div_code'] == int(value['div_code'])):
						dataArr.append(item['bran_name'])
						dataArr.append(item['bran_code'])

			elif(value['div'] == 'tunnel'):
				r = requests.get('http://api.jetfan.ga:5007/tunnel')
				tunnel = json.loads(r.text)

				for item in tunnel:
					if(item['tunn_bran_code'] == int(value['div_code'])):
						dataArr.append(item['tunn_name'])
						dataArr.append(item['tunn_code'])

			elif(value['div'] == 'jetfan_way'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan')
				jetfan = json.loads(r.text)

				for item in jetfan:
					if(item['tunn_code'] == int(value['div_code'])):
						dataArr.append(item['jetfan_way'])

			elif(value['div'] == 'jetfan_lane'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan')
				jetfan = json.loads(r.text)

				for item in jetfan:
					if(item['tunn_code'] == int(value['div_code'])):
						dataArr.append(item['jetfan_lane'])

			elif(value['div'] == 'jetfan_no'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan')
				jetfan = json.loads(r.text)

				for item in jetfan:
					if(item['tunn_code'] == int(value['div_code'])):
						dataArr.append(item['jetfan_no'])
				

			return str(dataArr)


class Trace2(MethodView):
	def get(self):
		return render_template('test.html', credit='')