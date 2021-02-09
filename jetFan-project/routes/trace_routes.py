from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

from . import Base_url
global base_url
base_url = Base_url.go_url


# 추적도면 GET
# 추적도면 POST : 시설이력, 운전점검
class Trace(MethodView):
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

		return render_template('trace.html', depts=depts,
											 brans=brans,
											 tunns=tunns,
											 jetfans=jetfans, 
											 years= years)
	
	def post(self):
		value = request.get_json()

		for prop_name in ['jetfan_no', 'year', 'year_no']:
			if(value[prop_name] == ''):
				return '데이터누락', 406

		# 시설이력 및 운전점검
		url_status = base_url + 'evaluation/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		trace_status_r = requests.get(url_status)
		eval_result = json.loads(trace_status_r.text)
		
		data = {}
		if(eval_result['status']['status_code'] == 200 and eval_result['status']['error_code'] == 0):
			data['eval'] = eval_result['data'][0]

			# 현상태 점검현황
			url_name_chk = base_url + 'trace-check/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
			trace_chk_r = requests.get(url_name_chk)
			chk_result = json.loads(trace_chk_r.text)
			if(chk_result['status']['status_code'] == 200 and chk_result['status']['error_code'] == 0):
				checkArr = []
				for item in chk_result['data']:
					checkArr.append(item['tc_content'])
				data['tc_content'] = checkArr
				data['update'] = chk_result['data'][0]['tc_update']
			else:
				data['err_msg'] = chk_result['status']['error_msg']
				return json.dumps(data)


			# 비고 (기능상태 등)
			url_name_note = base_url + 'trace-note/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
			trace_note_r = requests.get(url_name_note)
			note_result = json.loads(trace_note_r.text)
			if(note_result['status']['status_code'] == 200 and note_result['status']['error_code'] == 0):
				noteCurYear = []
				noteOneYearAgo = []
				noteTowYearAgo = []
				for item in note_result['data']:
					if(int(item['tn_year']) == int(value['year'])):
						noteCurYear.append(item['tn_content'])
					elif(int(item['tn_year']) == int(value['year'])-1):
						noteOneYearAgo.append(item['tn_content'])
					elif(int(item['tn_year']) == int(value['year'])-2):
						noteTowYearAgo.append(item['tn_content'])

				data['noteCurYear'] = noteCurYear
				data['noteOneYearAgo'] = noteOneYearAgo
				data['noteTowYearAgo'] = noteTowYearAgo
			else:
				data['err_msg'] = note_result['status']['error_msg']
				return json.dumps(data)
		
		else:
			data['err_msg'] = eval_result['status']['error_msg']
			return json.dumps(data)

		return json.dumps(data)

	
	# 현상태 점검현황 및 비고 데이터 입력/수정
	def put(self):
		data = {}
		value = request.get_json()

		for prop_name in ['jetfan_no', 'year', 'year_no']:
			if(value[prop_name] == ''):
				return '데이터누락', 406

		chk_url = base_url + "trace-check/" +  value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		chk_r = requests.put(chk_url, data=json.dumps(value['tc_content']))
		chk_result = json.loads(chk_r.text);
		
		note_url = base_url + "trace-note/" +  value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		note_r = requests.put(note_url, data=json.dumps(value['tn_content']))
		note_result = json.loads(note_r.text);

		if(chk_result['status']['status_code'] == 200 and note_result['status']['status_code'] == 200):		
			return json.dumps('ok')
		else:
			data['err_msg'] = chk_result['status']['error_msg']
			return json.dumps(data)