from flask.views import MethodView
from flask import render_template, request, session
from werkzeug.utils import secure_filename

import datetime
import requests
import json
import os

from . import Base_url
global base_url
base_url = Base_url.go_url


class Abnormal(MethodView):
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

		if session.get('username') is not None:
			emp = str(session.get('username')).strip("(',)")
		else:
			emp = ''

		return render_template('abnormal.html', depts=depts,
												brans=brans,
												tunns=tunns,
												years= years,
												emp=emp)

	def post(self):
		v = request.get_json()
		data = {}
		
		if(v['option'] == 'getContent'):
			for prop_name in ['tunn_code', 'year', 'year_no']:
				if(v[prop_name] == ''):
					return '데이터누락', 406
			
			# 이상소견, 현장점검 소견
			ar_r = requests.get(base_url + 'abnormal-report/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'])
			ar_result = json.loads(ar_r.text)

			if(ar_result['status']['status_code'] == 200 and ar_result['status']['error_code'] == 0):
				errorContent = []
				chkContent = []
				for item in ar_result['data']:
					if(item['ar_type'] == 1):
						errorContent.append(item['ar_content'])
					elif(item['ar_type'] == 2):
						chkContent.append(item['ar_content'])
				data['error'] = errorContent;
				data['chk'] = chkContent
				data['update'] = 0
				if ar_result['data']:
					data['update'] = ar_result['data'][0]['ar_update']
			else:
				data['err_msg'] = ar_result['status']['error_msg']
				return json.dumps(data)

			# 참고사진
			ap_r = requests.get(base_url + 'abnormal-photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'])
			ap_result = json.loads(ap_r.text)
			if(ap_result['status']['status_code'] == 200 and ap_result['status']['error_code'] == 0):
				data['photo'] = {'ap_seq': [], 'ap_way': [], 'ap_jetfan_no': [], 'ap_comment': [], 'ap_photo': []}
				for item in ap_result['data']:
					data['photo']['ap_seq'].append(item['ap_seq'])
					data['photo']['ap_way'].append(item['ap_way'])
					data['photo']['ap_jetfan_no'].append(item['ap_jetfan_no'])
					data['photo']['ap_comment'].append(item['ap_comment'])
					data['photo']['ap_photo'].append(item['ap_photo'])
			else:
				data['err_msg'] = ap_result['status']['error_msg']
				return json.dumps(data)


			# 하단 터널방향
			way_r = requests.get(base_url + 'tunnel/tunn_code/' + v['tunn_code'])
			way_result = json.loads(way_r.text)
			if(way_result['status']['status_code'] == 200  and way_result['status']['error_code'] == 0):
				data['way1'] = way_result['data'][0]['tunn_way1']
				data['way2'] = way_result['data'][0]['tunn_way2']
			else:
				data['err_msg'] = way_result['status']['error_msg']
				return json.dumps(data)


			# 하단 제트팬가져오기
			jetfan1_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + data['way1'])
			jetfan1_result = json.loads(jetfan1_r.text)
			jetfanArr = []; jetfanYmd = []
			if(jetfan1_result['status']['status_code'] == 200  and jetfan1_result['status']['error_code'] == 0):
				for item in jetfan1_result['data']:
					jetfanArr.append(item['jetfan_no'])
					ymd_r = requests.get(base_url + 'evaluation/' + str(item['jetfan_code']) + '/' + v['year'] + '/' + v['year_no'])
					ymd_items = json.loads(ymd_r.text)
					if(ymd_items['status']['status_code'] == 200  and ymd_items['status']['error_code'] == 0):
						try:
							jetfanYmd.append(ymd_items['data'][0]['eval_ymd'].split('T')[0])
						except:
							jetfanYmd.append('')
					# else:
					# 	data['err_msg'] = ymd_items['status']['error_msg']
					# 	return json.dumps(data)
			else:
				data['err_msg'] = jetfan1_result['status']['error_msg']
				return json.dumps(data)
			

			jetfan2_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + data['way2'])
			jetfan2_result = json.loads(jetfan2_r.text)
			if(jetfan2_result['status']['status_code'] == 200 and jetfan2_result['status']['error_code'] == 0):
				for item in jetfan2_result['data']:
					ymd_r = requests.get(base_url + 'evaluation/' + str(item['jetfan_code']) + '/' + v['year'] + '/' + v['year_no'])
					ymd_items = json.loads(ymd_r.text)
					if(ymd_items['status']['status_code'] == 200 and ymd_items['status']['error_code'] == 0):
						try:
							jetfanYmd.append(ymd_items['data'][0]['eval_ymd'].split('T')[0])
						except:
							jetfanYmd.append('')
					# else:
					# 	data['err_msg'] = ymd_items['status']['error_msg']
					# 	return json.dumps(data)
			
				data['jetfan'] = jetfanArr
				data['ymd'] = list(filter(None,set(jetfanYmd)))

			else:
				data['err_msg'] = jetfan2_result['status']['error_msg']
				return json.dumps(data)

			return json.dumps(data)


		elif(v['option'] == 'getJetfan'):
			
			for prop_name in ['tunn_code', 'way']:
				if(v[prop_name] == ''):
					return '데이터누락', 406
			
			r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + v['way'])
			items = json.loads(r.text)
			if(items['status']['status_code'] == 200 and items['status']['error_code'] == 0):
				jetfan = []
				for item in items['data']:
					jetfan.append(item['jetfan_no'])
				data['jetfan'] = jetfan
			else:
				data['err_msg'] = items['status']['error_msg']

			return json.dumps(data)
		
		elif(v['option'] == 'addContent'):
			for prop_name in ['tunn_code', 'year', 'year_no']:
				if(v[prop_name] == ''):
					return '데이터누락', 406

			url = base_url + 'abnormal-photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no']
			r = requests.post(url, data=json.dumps(v['data']))
			result = json.loads(r.text)
			if(result['status']['status_code'] == 200 and result['status']['error_code'] == 0):
				data['succ'] = 200
			else:
				data['err_msg'] = result['status']['error_msg']
			return json.dumps(data)

	def put(self):
		data = {}
		v = request.get_json()

		for prop_name in ['tunn_code', 'year', 'year_no']:
			if(v[prop_name] == ''):
				return '데이터누락', 406
		
		url = base_url + 'abnormal-report/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no']
		r = requests.put(url, data=json.dumps(v['data']))
		result = json.loads(r.text)

		if(result['status']['status_code'] == 200 and result['status']['error_code'] == 0):
			data['succ'] = 200
		else:
			data['err_msg'] = result['status']['error_msg']

		return json.dumps(result)

	def delete(self):
		data = {}
		v = request.get_json()

		for prop_name in ['tunn_code', 'year', 'year_no']:
			if(v[prop_name] == ''):
				return '데이터누락', 406

		url = base_url + 'abnormal-photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'] + '/' + v['seq']
		r = requests.delete(url)
		result = json.loads(r.text)
		if(result['status']['status_code'] == 200 and result['status']['error_code'] == 0):
			# 서버에 있는 파일 삭제
			dir_path = './static/data/abnormal/' + v['year'] + '/' + v['year_no'] + '/'
			file_name = 'a_' + v['tunn_code'] + '_' + v['seq'] + '.jpg'
			os.remove(dir_path + secure_filename(file_name))
			data['succ'] = 200
		else:
			data['err_msg'] = result['status']['error_msg']
			
		return json.dumps(data)


class Abupload(MethodView):
	def post(self):
		if 'file' not in request.files:
			return 'fail'
		
		else:
			f = request.files['file']
			year = request.form['year']
			year_no = request.form['year_no']
			tunn_code = request.form['tunn_code']
			seq = request.form['seq']
			
			dir_path = './static/data/abnormal/' + year + '/' + year_no + '/'
			file_name = 'a_' + tunn_code + '_' + seq + '.jpg'

			f.save(dir_path + secure_filename(file_name))

			return 'succ'