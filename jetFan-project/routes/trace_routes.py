from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

# import log

# 추적도면 GET
# 추적도면 POST : 시설이력, 운전점검
class Trace(MethodView):
	def get(self):
		r = requests.get('http://api.jetfan.ga:5007/division')
		depts = json.loads(r.text)

		years = []
		year = datetime.date.today().year
		# year = 2023
		for i in range(year+1-2020):
			years.append(year-i)
		years.reverse()

		return render_template('trace.html', depts=depts, years= years)
	
	def post(self):
		dataArr = []
		value = request.get_json()

		# 시설이력 및 운전점검
		url_status = 'http://api.jetfan.ga:5007/evaluation/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		trace_status_r = requests.get(url_status)
		evaluation = json.loads(trace_status_r.text)

		# log.log("trace_routes : eval_jetfan_code-->", evaluation[0]['eval_jetfan_code']) 
		dataArr = evaluation


		# 현상태 점검현황
		url_name_chk = 'http://api.jetfan.ga:5007/trace-check/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		trace_chk_r = requests.get(url_name_chk)
		trace_check = json.loads(trace_chk_r.text)

		checkArr = []
		for item in trace_check:
			# log.log("trace_routes3 : tc_jetfan_code-->", item['tc_jetfan_code']) 
			checkArr.append(item['tc_seq'])
			checkArr.append(item['tc_content'])

		dataArr.append(checkArr)


		# 비고 (기능상태 등)
		url_name_note = 'http://api.jetfan.ga:5007/trace-note/' + value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		trace_note_r = requests.get(url_name_note)
		trace_note = json.loads(trace_note_r.text)

		noteCurYear = []
		noteOneYearAgo = []
		noteTowYearAgo = []
		curYear = datetime.date.today().year
		for item in trace_note:
			# log.log("trace_routes3 : tn_jetfan_code-->", item['tn_jetfan_code']) 
			# log.log("trace_routes3 : tn_year-->", item['tn_year']) 
			if(int(item['tn_year']) == curYear):
				noteCurYear.append(item['tn_seq'])
				noteCurYear.append(item['tn_content'])
			elif(int(item['tn_year']) == curYear-1):
				noteOneYearAgo.append(item['tn_seq'])
				noteOneYearAgo.append(item['tn_content'])
			elif(int(item['tn_year']) == curYear-2):
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

		url="http://api.jetfan.ga:5007/trace-check/" +  value['jetfan_no'] + '/' + value['year'] + '/' + value['year_no']
		chk_r = requests.put(url, data=json.dumps(value['tc_content']))
		note_r = requests.put(url, data=json.dumps(value['tn_content']))
		chk_data = json.loads(chk_r.text);
		note_data = json.loads(note_r.text);
		
		data.append(chk_data)
		data.append(note_data)

		return json.dumps(data)