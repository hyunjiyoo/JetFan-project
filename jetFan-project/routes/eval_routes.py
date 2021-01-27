from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

from . import Base_url
global base_url
base_url = Base_url.go_url

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
		year = datetime.date.today().year
		for i in range(year+1-2020):
			years.append(year-i)

		return render_template('evaluation.html', depts=depts,
												  brans=brans,
												  tunns=tunns,
												  jetfans=jetfans, 
												  years= years)
	
	def post(self):
		value = request.get_json()

		# 전년도 평가표데이터 가져오기
		r = requests.get(base_url + 'evaluation/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no'])
		basic_info = json.loads(r.text)

		return json.dumps(basic_info[0])

	
	def put(self):
		v = request.get_json()

		jetfan_no = v['data'][0]['eval_jetfan_code']
		year = v['data'][0]['eval_year']
		year_no =  v['data'][0]['eval_year_no']
		
		# 평가표 데이터 입력/수정
		url = base_url + 'evaluation/' + jetfan_no + '/' + year + '/' + year_no
		r = requests.put(url, data=json.dumps(v['data']))
		result = json.loads(r.text)
		
		return json.dumps(result)