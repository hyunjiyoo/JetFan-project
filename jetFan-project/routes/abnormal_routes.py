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
		jetfan_r = requests.get(base_url + 'jetfan-way/101/수리상행')
		depts = json.loads(div_r.text)
		brans = json.loads(bran_r.text)
		tunns = json.loads(tunn_r.text)
		jetfans = json.loads(jetfan_r.text)

		years = []
		year = datetime.date.today().year
		for i in range(year+1-2020):
			years.append(year-i)

		return render_template('abnormal.html', depts=depts,
											 brans=brans,
											 tunns=tunns,
											 jetfans=jetfans, 
											 years= years)

	def post(self):
		v = request.get_json()
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
			photoContent.append(item['ap_jetfan_no'])
			photoContent.append(item['ap_comment'])
			photoContent.append(item['ap_photo'])
		dataArr.append(photoContent)
		

		return json.dumps(dataArr)