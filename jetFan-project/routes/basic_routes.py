from flask.views import MethodView
from flask import render_template, request

import requests, datetime
import json

from . import Base_url
global base_url
base_url = Base_url.go_url

# 데이터생성 
class Basic(MethodView):
	def get(self):
		div_r = requests.get(base_url + 'division')
		bran_r = requests.get(base_url + 'branch/bran_div_code/11')
		tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/11')
		depts = json.loads(div_r.text)
		brans = json.loads(bran_r.text)
		tunns = json.loads(tunn_r.text)

		years = []
		year = datetime.date.today().year + 2
		for i in range(year-2020):
			years.append(year-i-1)

		return render_template('basic.html', depts=depts,
											 brans=brans,
											 tunns=tunns,
											 years= years)

	def post(self):
		v = request.get_json()
		data = {}

		if(v['div'] == 'branch'):
			bran_r = requests.get(base_url + 'branch/bran_div_code/' + v['div_code'])
			bran_item = json.loads(bran_r.text)
			branName = []
			branCode = []
			for bran in bran_item['data']:
				branName.append(bran['bran_name'])
				branCode.append(bran['bran_code'])
			
			data['bran_name'] = branName
			data['bran_code'] = branCode

			tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/' + str(branCode[0]))
			tunn_item = json.loads(tunn_r.text)
			tunnName = []
			tunnCode = []
			for tunn in tunn_item['data']:
				tunnName.append(tunn['tunn_name'])
				tunnCode.append(tunn['tunn_code'])

			data['tunn_name'] = tunnName
			data['tunn_code'] = tunnCode

		elif(v['div'] == 'tunnel'):
			tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/' + v['div_code'])
			tunn_item = json.loads(tunn_r.text)
			tunnName = []
			tunnCode = []
			
			for tunn in tunn_item['data']:
				tunnName.append(tunn['tunn_name'])
				tunnCode.append(tunn['tunn_code'])

			data['tunn_name'] = tunnName
			data['tunn_code'] = tunnCode


		return json.dumps(data)

class CreateData(MethodView):
	def post(self):
		v = request.get_json()

		r = requests.post(base_url + 'basic/' + v['div'] + '/' + v['code'] + '/' + v['year'] + '/' + v['emp'])
		result = json.loads(r.text)

		return json.dumps(result)