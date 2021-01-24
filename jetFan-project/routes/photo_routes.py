from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

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
		dataArr = []
		
		if(v['option'] == 'getContent'):
			photo_r = requests.get(base_url + 'photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'])
			photo_items = json.loads(photo_r.text)
			
			photoArr = []
			for item in photo_items:
				photoArr.append(item['photo_seq'])
				photoArr.append(item['photo_jetfan_no'])
				photoArr.append(item['photo_comment'])
				photoArr.append(item['photo_photo'])
			dataArr.append(photoArr)


			# 하단 터널방향
			way_r = requests.get(base_url + 'tunnel/tunn_code/' + v['tunn_code'])
			way_items = json.loads(way_r.text)
			wayArr = []
			wayArr.append(way_items[0]['tunn_way1'])
			wayArr.append(way_items[0]['tunn_way2'])
			dataArr.append(wayArr)

			# 하단 제트팬가져오기
			jetfan_r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + way_items[0]['tunn_way1'])
			jetfan_items = json.loads(jetfan_r.text)
			jetfanArr = []
			for item in jetfan_items:
				jetfanArr.append(item['jetfan_no'])
			dataArr.append(jetfanArr)

			return json.dumps(dataArr)


		elif(v['option'] == 'getJetfan'):
			r = requests.get(base_url + 'jetfan-way/' + v['tunn_code'] + '/' + v['way'])
			items = json.loads(r.text)

			for item in items:
				dataArr.append(item['jetfan_no'])

			return json.dumps(dataArr)

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

		return json.dumps(result)