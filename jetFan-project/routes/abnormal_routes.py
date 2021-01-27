from flask.views import MethodView
from flask import render_template, request

import datetime
import requests
import json

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
			dataArr = []
			
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
			dataArr.append(errorContent)
			dataArr.append(chkContent)

			# 참고사진
			ap_r = requests.get(base_url + 'abnormal-photo/' + v['tunn_code'] + '/' + v['year'] + '/' + v['year_no'])
			ap_items = json.loads(ap_r.text)
			photoContent = []
			for item in ap_items:
				photoContent.append(item['ap_seq'])
				photoContent.append(item['ap_way'])
				photoContent.append(item['ap_jetfan_no'])
				photoContent.append(item['ap_comment'])
				photoContent.append(item['ap_photo'])
			dataArr.append(photoContent)


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

			jetfan = []
			for item in items:
				jetfan.append(item['jetfan_no'])

			return json.dumps(jetfan)
		
		elif(v['option'] == 'addContent'):
			# db insert 쿼리만 날렸고, 파일도 업로드되어야함 
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

		return json.dumps(result)
