from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

# 평가표 
class Eval(MethodView):
	def get(self):
		r = requests.get('http://api.jetfan.ga:5007/division')
		depts = json.loads(r.text)

		years = []
		year = datetime.date.today().year
		# year = 2023
		for i in range(year+1-2020):
			years.append(year-i)
		years.reverse()

		return render_template('evaluation.html', depts=depts, years= years)
	
	def post(self):
		dataArr = []
		value = request.get_json()

		# 기본 정보
		r = requests.get('http://api.jetfan.ga:5007/evaluation/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no'])
		basic_info = json.loads(r.text)
		if(basic_info != []):
			dataArr = basic_info[0]
		else:
			dataArr = basic_info

		return json.dumps(dataArr)

	
	def put(self):
		dataArr = []
		value = request.get_json()

		# 기본 정보
		url = 'http://api.jetfan.ga:5007/evaluation/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		r = requests.put(url, data=json.dumps(value['data']))
		data = json.loads(r.text)

		# return json.dumps(data)
		return data
