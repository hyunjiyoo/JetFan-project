from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

from . import Base_url
global base_url
base_url = Base_url.go_url


class Inspection(MethodView):
	def get(self):
		div_r = requests.get(base_url + 'division')
		bran_r = requests.get(base_url + 'branch/bran_div_code/11')
		tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/11')
		depts = json.loads(div_r.text)
		brans = json.loads(bran_r.text)
		tunns = json.loads(tunn_r.text)

		years = []
		year = datetime.date.today().year
		for i in range(year+1-2020):
			years.append(year-i)

		return render_template('inspection.html', depts=depts,
												brans=brans,
												tunns=tunns,
												years= years)

	def post(self):
		v = request.get_json()

		inspect_r = requests.get(base_url + 'inspection/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'])
		inspect_items = json.loads(inspect_r.text)

		jetfan1_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + inspect_items[0]['tunn_way1'])
		jetfan2_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + inspect_items[0]['tunn_way2'])
		jetfan1_items = json.loads(jetfan1_r.text)
		jetfan2_items = json.loads(jetfan2_r.text)
		
		jetfan1 = []
		jetfan2 = []
		jetfan_ymd = []
		for data in jetfan1_items:
			jetfan1.append(data['jetfan_no'])
			ymd1_r = requests.get(base_url + 'evaluation/' + str(data['jetfan_code']) + '/' + v['year'] + '/' + v['year_no'])
			ymd1_items = json.loads(ymd1_r.text)
			jetfan_ymd.append(ymd1_items[0]['eval_ymd'][0:10])

		for data in jetfan2_items:
			jetfan2.append(data['jetfan_no'])
			ymd2_r = requests.get(base_url + 'evaluation/' + str(data['jetfan_code']) + '/' + v['year'] + '/' + v['year_no'])
			ymd2_items = json.loads(ymd2_r.text)
			jetfan_ymd.append(ymd2_items[0]['eval_ymd'][0:10])

		inspect_items[0]['way1_jetfan'] = jetfan1
		inspect_items[0]['way2_jetfan'] = jetfan2
		inspect_items[0]['ymd_jetfan'] = list(set(jetfan_ymd))

		return json.dumps(inspect_items[0])

	def put(self):
		v = request.get_json()
		tunn_code = str(v['data'][0]['ins_tunn_code'])
		year = v['data'][0]['ins_year']
		year_no =  v['data'][0]['ins_year_no']
		
		url = base_url + 'inspection/' + tunn_code + '/' + year + '/' + year_no
		r = requests.put(url, data=json.dumps(v['data']))
		result = json.loads(r.text)

		return json.dumps(result)