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
				r = requests.get('http://api.jetfan.ga:5007/branch/bran_div_code/' + value['div_code'])
				branch = json.loads(r.text)

				for item in branch:
					dataArr.append(item['bran_name'])
					dataArr.append(item['bran_code'])

			elif(value['div'] == 'tunnel'):
				r = requests.get('http://api.jetfan.ga:5007/tunnel/tunn_bran_code/' + value['div_code'])
				tunnel = json.loads(r.text)

				for item in tunnel:
					dataArr.append(item['tunn_name'])
					dataArr.append(item['tunn_code'])

			elif(value['div'] == 'jetfan_way'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan/tunn_code/' + value['div_code'])
				jetfan = json.loads(r.text)

				for item in jetfan:
					dataArr.append(item['jetfan_way'])

			elif(value['div'] == 'jetfan_lane'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan/tunn_code/' + value['div_code'])
				jetfan = json.loads(r.text)

				for item in jetfan:
					dataArr.append(item['jetfan_lane'])

			elif(value['div'] == 'jetfan_no'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan/tunn_code/' + value['div_code'])
				jetfan = json.loads(r.text)

				for item in jetfan:
					dataArr.append(item['jetfan_no'])
					dataArr.append(item['jetfan_code'])
					# dataArr.append(item['jetfan_maker'])
			
			elif(value['div'] == 'eval_year'):
				r = requests.get('http://api.jetfan.ga:5007/evaluation')
				year = json.loads(r.text)

				for item in year:
					if(item['eval_jetfan_code'] == int(value['div_code'])):
						dataArr.append(item['eval_year'])
				

			# return str(value)
			return str(dataArr)


class Trace2(MethodView):
	def get(self):
		return render_template('test.html', credit='')