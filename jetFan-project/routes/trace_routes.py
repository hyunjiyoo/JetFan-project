from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

# import log

# 추적도면 GET
# 추적도면 POST : 시설이력, 운전점검
class Trace(MethodView):
	global base_url
	base_url = 'http://api.jetfan.ga:5007/'

	def get(self):
		div_r = requests.get(base_url + 'division')
		bran_r = requests.get(base_url + 'branch/bran_div_code/11')
		tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/11')
		jetfan_r = requests.get(base_url + 'jetfan-way/101/수리상행')
		depts = json.loads(div_r.text)
		brans = json.loads(bran_r.text)
		tunns = json.loads(tunn_r.text)
		jetfans = json.loads(jetfan_r.text)

		years = []
		year = datetime.date.today().year
		for i in range(year+1-2020):
			years.append(year-i)

		return render_template('trace.html', depts=depts,
											 brans=brans,
											 tunns=tunns,
											 jetfans=jetfans, 
											 years= years)
	
	def post(self):
		dataArr = []
		value = request.get_json()

		# 시설이력 및 운전점검
		url_status = base_url + 'evaluation/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		trace_status_r = requests.get(url_status)
		evaluation = json.loads(trace_status_r.text)

		# log.log("trace_routes : eval_jetfan_code-->", evaluation[0]['eval_jetfan_code']) 
		dataArr = evaluation

		# 현상태 점검현황
		url_name_chk = base_url + 'trace-check/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		trace_chk_r = requests.get(url_name_chk)
		trace_check = json.loads(trace_chk_r.text)

		checkArr = []
		for item in trace_check:
			# log.log("trace_routes3 : tc_jetfan_code-->", item['tc_jetfan_code']) 
			checkArr.append(item['tc_seq'])
			checkArr.append(item['tc_content'])

		dataArr.append(checkArr)


		# 비고 (기능상태 등)
		url_name_note = base_url + 'trace-note/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		trace_note_r = requests.get(url_name_note)
		trace_note = json.loads(trace_note_r.text)

		noteCurYear = []
		noteOneYearAgo = []
		noteTowYearAgo = []
		for item in trace_note:
			# log.log("trace_routes3 : tn_jetfan_code-->", item['tn_jetfan_code']) 
			# log.log("trace_routes3 : tn_year-->", item['tn_year']) 
			if(int(item['tn_year']) == int(value['year'])):
				noteCurYear.append(item['tn_seq'])
				noteCurYear.append(item['tn_content'])
			elif(int(item['tn_year']) == int(value['year'])-1):
				noteOneYearAgo.append(item['tn_seq'])
				noteOneYearAgo.append(item['tn_content'])
			elif(int(item['tn_year']) == int(value['year'])-2):
				noteTowYearAgo.append(item['tn_seq'])
				noteTowYearAgo.append(item['tn_content'])

		dataArr.append(noteCurYear)
		dataArr.append(noteOneYearAgo)
		dataArr.append(noteTowYearAgo)

		return json.dumps(dataArr)

	
	# 현상태 점검현황 및 비고 데이터 입력/수정
	def put(self):
		data = []
		value = request.get_json()

		chk_url = base_url + "trace-check/" +  value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		note_url = base_url + "trace-note/" +  value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		chk_r = requests.put(chk_url, data=json.dumps(value['tc_content']))
		note_r = requests.put(note_url, data=json.dumps(value['tn_content']))
		chk_data = json.loads(chk_r.text);
		note_data = json.loads(note_r.text);
		
		data.append(chk_data)
		data.append(note_data)

		return json.dumps(data)