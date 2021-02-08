from flask.views import MethodView
from flask import render_template, request
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
		year = datetime.date.today().year
		for i in range(year+1-2020):
			years.append(year-i)

		return render_template('abnormal.html', depts=depts,
												brans=brans,
												tunns=tunns,
												years= years)

	def post(self):
		v = request.get_json()
		
		if(v['option'] == 'getContent'):
			data = {}
			
			# 이상소견, 현장점검 소견
			ar_r = requests.get(base_url + 'abnormal-report/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'])
			ar_items = json.loads(ar_r.text)
			errorContent = []
			chkContent = []
			for item in ar_items:
				if(item['ar_type'] == 1):
					errorContent.append(item['ar_content'])
				elif(item['ar_type'] == 2):
					chkContent.append(item['ar_content'])
			data['error'] = errorContent;
			data['chk'] = chkContent
			data['update'] = 0
			if ar_items:
				data['update'] = ar_items[0]['ar_update']

			# 참고사진
			ap_r = requests.get(base_url + 'abnormal-photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'])
			ap_items = json.loads(ap_r.text)
			data['photo'] = {'ap_seq': [], 'ap_way': [], 'ap_jetfan_no': [], 'ap_comment': [], 'ap_photo': []}
			for item in ap_items:
				data['photo']['ap_seq'].append(item['ap_seq'])
				data['photo']['ap_way'].append(item['ap_way'])
				data['photo']['ap_jetfan_no'].append(item['ap_jetfan_no'])
				data['photo']['ap_comment'].append(item['ap_comment'])
				data['photo']['ap_photo'].append(item['ap_photo'])


			# 하단 터널방향
			way_r = requests.get(base_url + 'tunnel/tunn_code/' + v['tunn_code'])
			way_items = json.loads(way_r.text)
			data['way1'] = way_items[0]['tunn_way1']
			data['way2'] = way_items[0]['tunn_way2']

			# 하단 제트팬가져오기
			jetfan1_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + way_items[0]['tunn_way1'])
			jetfan1_items = json.loads(jetfan1_r.text)
			jetfanArr = []
			jetfanYmd = []
			for item in jetfan1_items:
				jetfanArr.append(item['jetfan_no'])
				ymd_r = requests.get(base_url + 'evaluation/' + str(item['jetfan_code']) + '/' + v['year'] + '/' + v['year_no'])
				ymd_items = json.loads(ymd_r.text)
				if(ymd_items is not None):
					for ymd in ymd_items:
						jetfanYmd.append(ymd['eval_ymd'][:10])
				else:
						jetfanYmd.append('')

			jetfan2_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + way_items[0]['tunn_way2'])
			jetfan2_items = json.loads(jetfan2_r.text)
			jetfanYmd = []
			for item in jetfan2_items:
				ymd_r = requests.get(base_url + 'evaluation/' + str(item['jetfan_code']) + '/' + v['year'] + '/' + v['year_no'])
				ymd_items = json.loads(ymd_r.text)
				if(ymd_items is not None):
					for ymd in ymd_items:
						jetfanYmd.append(ymd['eval_ymd'][:10])
				else:
					jetfanYmd.append('')
			
			data['jetfan'] = jetfanArr
			data['ymd'] = list(set(jetfanYmd))

			return json.dumps(data)


		elif(v['option'] == 'getJetfan'):
			r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + v['way'])
			items = json.loads(r.text)

			jetfan = []
			for item in items:
				jetfan.append(item['jetfan_no'])

			return json.dumps(jetfan)
		
		elif(v['option'] == 'addContent'):
			url = base_url + 'abnormal-photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no']
			r = requests.post(url, data=json.dumps(v['data']))
			result = json.loads(r.text)

			return json.dumps(result)

	def put(self):
		v = request.get_json()
		url = base_url + 'abnormal-report/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no']
		r = requests.put(url, data=json.dumps(v['data']))
		result = json.loads(r.text)

		return json.dumps(result)

	def delete(self):
		v = request.get_json()
		url = base_url + 'abnormal-photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'] + '/' + v['seq']
		r = requests.delete(url)
		result = json.loads(r.text)

		# 서버에 있는 파일 삭제
		dir_path = './static/data/abnormal/' + v['year'] + '/' + v['year_no'] + '/'
		file_name = 'a_' + v['tunn_code'] + '_' + v['seq'] + '.jpg'
		os.remove(dir_path + secure_filename(file_name))

		return json.dumps(result)


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