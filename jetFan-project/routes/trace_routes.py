from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

# 추적도면 route
class Trace(MethodView):
	def get(self):
		if request.method == 'GET':
			r = requests.get('http://api.jetfan.ga:5007/division')
			depts = json.loads(r.text)
			return render_template('trace.html', depts=depts, today_date= datetime.date.today())
	
	def post(self):
		if request.method == 'POST':
			dataArr = []
			value = request.get_json()
			
			if(value['div'] == 'branch'):
				r = requests.get('http://api.jetfan.ga:5007/branch/bran_div_code/' + value['div_code'])
				branch = json.loads(r.text)

				for item in branch:
					dataArr.append(item['bran_name'])
					dataArr.append(item['bran_code'])

			elif(value['div'] == 'tunnel'):
				r = requests.get('http://api.jetfan.ga:5007/tunnel/tunn_bran_code/' + value['div_code'])
				tunnel = json.loads(r.text)

				for item in tunnel:
					dataArr.append(item['tunn_name'])
					dataArr.append(item['tunn_code'])

			elif(value['div'] == 'jetfan_way'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan/tunn_code/' + value['div_code'])
				jetfan = json.loads(r.text)

				for item in jetfan:
					dataArr.append(item['jetfan_way'])
				dataArr = list(set(dataArr))

			elif(value['div'] == 'jetfan_no'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan/tunn_code/' + value['div_code'])
				jetfan = json.loads(r.text)

				for item in jetfan:
					dataArr.append(item['jetfan_no'])
					dataArr.append(item['jetfan_code'])
					dataArr.append(item['jetfan_diagram'])
			
			elif(value['div'] == 'eval_year'):
				r = requests.get('http://api.jetfan.ga:5007/evaluation')
				year = json.loads(r.text)

				for item in year:
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
				
			elif(value['div'] == 'curStatusChk'):
				trace_chk_r = requests.get('http://api.jetfan.ga:5007/trace-check')
				trace_note_r = requests.get('http://api.jetfan.ga:5007/trace-note')
				trace_check = json.loads(trace_chk_r.text)
				trace_note = json.loads(trace_note_r.text)
				
				checkArr = []
				noteCurYear = []
				noteOneYearAgo = []
				noteTowYearAgo = []
				curYear = datetime.date.today().year
				for item in trace_check:
					if(item['tc_jetfan_code'] == int(value['div_code'])):
						checkArr.append(item['tc_seq'])
						checkArr.append(item['tc_content'])
				
				for item in trace_note:
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


class Trace2(MethodView):
	def get(self):
		return render_template('test.html', credit='')