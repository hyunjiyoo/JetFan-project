from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

import log

# 추적도면 GET
# 추적도면 POST : 시설이력, 운전점검
class traceSetJetfanData(MethodView):
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
		
		url_name = 'http://api.jetfan.ga:5007/evaluation/' + str(value['div_code']) + '/' + str(value['year']) + '/' + str(value['year_no'])
		r = requests.get(url_name)
		year = json.loads(r.text)

		for item in year:
			log.log("trace_routes : eval_jetfan_code-->", item['eval_jetfan_code']) 
			if(item['eval_jetfan_code'] == int(value['div_code'])):
				dataArr.append(item['eval_year'])
				dataArr.append(item['tunn_name'])
				dataArr.append(item['jetfan_way'])
				dataArr.append(item['jetfan_lane'])
				dataArr.append(item['jetfan_no'])
				dataArr.append(item['jetfan_maker'])
				dataArr.append(item['eval_emp'])
				dataArr.append(item['eval_ymd'])
				dataArr.append(item['eval_vibrate_y_1'])
				dataArr.append(item['eval_vibrate_x_1'])
				dataArr.append(item['eval_vibrate_z_1'])
				dataArr.append(item['eval_vibrate_y_2'])
				dataArr.append(item['eval_vibrate_x_2'])
				dataArr.append(item['eval_vibrate_z_2'])
				dataArr.append(item['eval_amp_r'])
				dataArr.append(item['eval_amp_s'])
				dataArr.append(item['eval_amp_t'])
				dataArr.append(item['eval_volt'])
				dataArr.append(item['eval_update'])

		return json.dumps(dataArr)


# 추적도면 POST: 현 상태 점검현황, 비고
class traceSetStatusChk(MethodView):
	def post(self):
		dataArr = []
		value = request.get_json()

		url_name_chk = 'http://api.jetfan.ga:5007/trace-check/' + str(value['div_code']) + '/' + str(value['year']) + '/' + str(value['year_no'])
		url_name_note = 'http://api.jetfan.ga:5007/trace-note/' + str(value['div_code']) + '/' + str(value['year']) + '/' + str(value['year_no'])

		trace_chk_r = requests.get(url_name_chk)
		trace_note_r = requests.get(url_name_note)
		
		trace_check = json.loads(trace_chk_r.text)
		trace_note = json.loads(trace_note_r.text)
		
		checkArr = []
		noteCurYear = []
		noteOneYearAgo = []
		noteTowYearAgo = []
		curYear = datetime.date.today().year
		for item in trace_check:
			log.log("trace_routes3 : tc_jetfan_code-->", item['tc_jetfan_code']) 
			if(item['tc_jetfan_code'] == int(value['div_code'])):
				checkArr.append(item['tc_seq'])
				checkArr.append(item['tc_content'])
		
		for item in trace_note:
			log.log("trace_routes3 : tn_jetfan_code-->", item['tn_jetfan_code']) 
			log.log("trace_routes3 : tn_year-->", item['tn_year']) 
			if(item['tn_jetfan_code'] == int(value['div_code'])):
				if(int(item['tn_year']) == curYear):
					noteCurYear.append(item['tn_year'])
					noteCurYear.append(item['tn_seq'])
					noteCurYear.append(item['tn_content'])
				elif(int(item['tn_year']) == curYear-1):
					noteOneYearAgo.append(item['tn_year'])
					noteOneYearAgo.append(item['tn_seq'])
					noteOneYearAgo.append(item['tn_content'])
				elif(int(item['tn_year']) == curYear-2):
					noteTowYearAgo.append(item['tn_year'])
					noteTowYearAgo.append(item['tn_seq'])
					noteTowYearAgo.append(item['tn_content'])

		dataArr.append(checkArr)
		dataArr.append(noteCurYear)
		dataArr.append(noteOneYearAgo)
		dataArr.append(noteTowYearAgo)

		return json.dumps(dataArr)