from flask.views import MethodView
from flask import render_template, request, session

import datetime
import requests
import json

from . import Base_url
global base_url
base_url = Base_url.go_url


class Inspection(MethodView):
	def get(self):
		all_tunn_r = requests.get(base_url + 'tunnel/')
		div_r = requests.get(base_url + 'division')
		bran_r = requests.get(base_url + 'branch/bran_div_code/11')
		tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/11')
		# jetfan_r = requests.get(base_url + 'jetfan-way/101/일산')
		all_tunns = json.loads(all_tunn_r.text)
		depts = json.loads(div_r.text)
		brans = json.loads(bran_r.text)
		tunns = json.loads(tunn_r.text)
		# jetfans = json.loads(jetfan_r.text)

		years = []
		year = datetime.date.today().year + 2
		for i in range(year-2020):
			years.append(year-i-1)

		if session.get('username') is not None:
			emp = str(session.get('username')).strip("(',)")
		else:
			emp = ''

		return render_template('inspection.html', 
												all_tunns=all_tunns,
												depts=depts,
												brans=brans,
												tunns=tunns,
												# jetfans=jetfans, 
												years= years,
												emp=emp)

	def post(self):
		v = request.get_json()
		
		for prop_name in ['tunn_code', 'year', 'year_no']:
			if(v[prop_name] == ''):
				return '데이터누락', 406

		data = {}
		inspect_r = requests.get(base_url + 'inspection/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'])
		inspect_result = json.loads(inspect_r.text)

		if(inspect_result['status']['status_code'] == 200 and inspect_result['status']['error_code'] == 0):
			tunn_way1 = inspect_result['data'][0]['tunn_way1']
			tunn_way2 = inspect_result['data'][0]['tunn_way2']
			jetfan1_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + tunn_way1)
			jetfan2_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + tunn_way2)
			jetfan1_result = json.loads(jetfan1_r.text)
			jetfan2_result = json.loads(jetfan2_r.text)
		
			jetfan1 = []; jetfan2 = []; jetfan_ymd = []
			if(jetfan1_result['status']['status_code'] == 200 and jetfan1_result['status']['error_code'] == 0):
				for data in jetfan1_result['data']:
					jetfan1.append(data['jetfan_no'])
					ymd1_r = requests.get(base_url + 'evaluation/' + str(data['jetfan_code']) + '/' + v['year'] + '/' + v['year_no'])
					ymd1_items = json.loads(ymd1_r.text)

					if(ymd1_items['status']['status_code'] == 200 and ymd1_items['status']['error_code'] == 0):
						try:
							jetfan_ymd.append(ymd1_items['data'][0]['eval_ymd'].split('T')[0])
						except:	
							jetfan_ymd.append('')
					# else:
					# 	data['err_msg'] = ymd1_items['status']['error_msg']
					# 	return json.dumps(data)
			else:
				data['err_msg'] = jetfan1_result['status']['error_msg']
				return json.dumps(data)

			if(jetfan2_result['status']['status_code'] == 200 and jetfan2_result['status']['error_code'] == 0):
				for data in jetfan2_result['data']:
					jetfan2.append(data['jetfan_no'])
					ymd2_r = requests.get(base_url + 'evaluation/' + str(data['jetfan_code']) + '/' + v['year'] + '/' + v['year_no'])
					ymd2_items = json.loads(ymd2_r.text)
					if(ymd2_items['status']['status_code'] == 200 and ymd2_items['status']['error_code'] == 0):
						try:
							jetfan_ymd.append(ymd2_items['data'][0]['eval_ymd'].split('T')[0])
						except:	
							jetfan_ymd.append('')
					# else:
					# 	data['err_msg'] = ymd2_items['status']['error_msg']
					# 	return json.dumps(data)
			else:
				data['err_msg'] = jetfan2_result['status']['error_msg']
				return json.dumps(data)

			data['ins'] = inspect_result['data'][0]
			data['way1_jetfan'] = jetfan1
			data['way2_jetfan'] = jetfan2
			data['ymd_jetfan'] = list(filter(None, set(jetfan_ymd)))

		else:
			data['err_msg'] = inspect_result['status']['error_msg']
			return json.dumps(data)

		return json.dumps(data)


	def put(self):
		v = request.get_json()

		for prop_name in ['ins_tunn_code', 'ins_year', 'ins_year_no']:
			if(v['data'][0][prop_name] == ''):
				return '데이터누락', 406

		tunn_code = str(v['data'][0]['ins_tunn_code'])
		year = v['data'][0]['ins_year']
		year_no =  v['data'][0]['ins_year_no']
		
		url = base_url + 'inspection/' + tunn_code + '/' + year + '/' + year_no
		r = requests.put(url, data=json.dumps(v['data']))
		result = json.loads(r.text)

		return json.dumps(result)