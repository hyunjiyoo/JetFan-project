from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

from . import Base_url
global base_url
base_url = Base_url.go_url

base_url = 'http://api.jetfan.ga:5005/'

# 평가표 
class Eval(MethodView):
	def get(self):
		div_r = requests.get(base_url + 'division')
		bran_r = requests.get(base_url + 'branch/bran_div_code/11')
		tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/11')
		jetfan_r = requests.get(base_url + 'jetfan-way/101/일산')
		depts = json.loads(div_r.text)
		brans = json.loads(bran_r.text)
		tunns = json.loads(tunn_r.text)
		jetfans = json.loads(jetfan_r.text)

		years = []
		year = datetime.date.today().year + 2
		for i in range(year-2020):
			years.append(year-i-1)

		return render_template('evaluation.html', depts=depts,
												  brans=brans,
												  tunns=tunns,
												  jetfans=jetfans, 
												  years= years)
	
	def post(self):
		value = request.get_json()

		# 전년도 평가표데이터 가져오기
		for prop_name in ['jetfan_no', 'year', 'year_no']:
			if(value[prop_name] == ''):
				return '데이터누락', 406

		r = requests.get(base_url + 'evaluation/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no'])
		basic_info = json.loads(r.text)
		
		data = {}
		if(basic_info['status']['status_code'] == 200):
			data = basic_info['data'][0]
		else:
			data['err_msg'] = basic_info['status']['error_msg']

		return json.dumps(data)


	
	def put(self):
		v = request.get_json()

		for prop_name in ['jetfan_no', 'year', 'year_no']:
			if(v[prop_name] == ''):
				return '데이터누락', 406
		
		# 평가표 데이터 입력/수정
		url = base_url + 'evaluation/' + v['jetfan_no'] + '/' + v['year'] + '/' + v['year_no']
		r = requests.put(url, data=json.dumps(v['contents']))
		result = json.loads(r.text)
		
		return json.dumps(result)