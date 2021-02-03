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

# 사진첩 
class Photo(MethodView):
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

		return render_template('photo.html', depts=depts,
											 brans=brans,
											 tunns=tunns,
											 years= years)

	def post(self):
		v = request.get_json()
		
		if(v['option'] == 'getContent'):
			data = {}
			photo_r = requests.get(base_url + 'photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'])
			photo_items = json.loads(photo_r.text)
			
			ph_seq = []
			ph_jetfan = []
			ph_comment = []
			ph_photo = []
			for item in photo_items:
				ph_seq.append(item['photo_seq'])
				ph_jetfan.append(item['photo_jetfan_no'])
				ph_comment.append(item['photo_comment'])
				ph_photo.append(item['photo_photo'])
			
			data['ph_seq'] = ph_seq
			data['ph_jetfan'] = ph_jetfan
			data['ph_comment'] = ph_comment
			data['ph_photo'] = ph_photo
			
			data['update'] = 0
			if photo_items:
				data['update'] = photo_items[0]['photo_update']

			# 하단 터널방향
			way_r = requests.get(base_url + 'tunnel/tunn_code/' + v['tunn_code'])
			way_items = json.loads(way_r.text)
			data['way1'] = way_items[0]['tunn_way1']
			data['way2'] = way_items[0]['tunn_way2']

			# 하단 제트팬가져오기
			jetfan_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + way_items[0]['tunn_way1'])
			jetfan_items = json.loads(jetfan_r.text)
			jetfanArr = []
			for item in jetfan_items:
				jetfanArr.append(item['jetfan_no'])
			data['jetfan_no'] = jetfanArr

			return json.dumps(data)


		elif(v['option'] == 'getJetfan'):
			jetfanArr = []
			r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + v['way'])
			items = json.loads(r.text)

			for item in items:
				jetfanArr.append(item['jetfan_no'])

			return json.dumps(jetfanArr)

		elif(v['option'] == 'addContent'):
			url = base_url + 'photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no']
			r = requests.post(url, data=json.dumps(v['data']))
			result = json.loads(r.text)
		
			return json.dumps(result)

	def put(self):
		v = request.get_json()
		url = base_url + 'photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no']
		r = requests.put(url, data=json.dumps(v['data']))
		result = json.loads(r.text)

		return json.dumps(result)
	
	def delete(self):
		v = request.get_json()
		url = base_url + 'photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'] + '/' + v['seq']
		r = requests.delete(url)
		result = json.loads(r.text)

		# 서버에 있는 파일 삭제
		dir_path = './static/data/photo/' + v['year'] + '/' + v['year_no'] + '/'
		file_name = 'p_' + v['tunn_code'] + '_' + v['seq'] + '.jpg'
		os.remove(dir_path + secure_filename(file_name))
		
		return json.dumps(result)
		

# 사진 파일 업로드
class Ptupload(MethodView):
	def post(self):
		if 'file' not in request.files:
			return 'fail'

		else:
			f = request.files['file']
			year = request.form['year']
			year_no = request.form['year_no']
			tunn_code = request.form['tunn_code']
			seq = request.form['seq']
			
			dir_path = './static/data/photo/' + year + '/' + year_no + '/'
			file_name = 'p_' + tunn_code + '_' + seq + '.jpg'

			f.save(dir_path + secure_filename(file_name))

			return 'succ'