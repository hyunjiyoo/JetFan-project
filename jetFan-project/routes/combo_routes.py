from flask.views import MethodView
from flask import request

import requests
import json

# 콤보박스
class Combo(MethodView):
	def post(self):
		dataArr = []
		value = request.get_json()
		
		# 터널명 검색했을 때 터널 가져오기
		if(value['div'] == 'tunn_search'):
			r = requests.get('http://api.jetfan.ga:5007/tunnel-search/' + value['div_code'])
			tunnel = json.loads(r.text)

			for item in tunnel:
				dataArr.append(item['tunn_name'])
				dataArr.append(item['tunn_code'])

		# 본부 클릭했을 때 지사 가져오기
		elif(value['div'] == 'branch'):
			r = requests.get('http://api.jetfan.ga:5007/branch/bran_div_code/' + value['div_code'])
			branch = json.loads(r.text)

			for item in branch:
				dataArr.append(item['bran_name'])
				dataArr.append(item['bran_code'])

		# 지사 클릭했을 때 터널 가져오기
		elif(value['div'] == 'tunnel'):
			r = requests.get('http://api.jetfan.ga:5007/tunnel/tunn_bran_code/' + value['div_code'])
			tunnel = json.loads(r.text)

			for item in tunnel:
				dataArr.append(item['tunn_name'])
				dataArr.append(item['tunn_code'])

		# 터널 클릭했을 때 제트팬 가져오기
		elif(value['div'] == 'jetfan_no'):
			r = requests.get('http://api.jetfan.ga:5007/jetfan/tunn_code/' + value['div_code'])
			jetfan = json.loads(r.text)

			for item in jetfan:
				dataArr.append(item['jetfan_no'])
				dataArr.append(item['jetfan_code'])
				dataArr.append(item['jetfan_way'])
		
		# 방향 클릭했을 때 제트팬 가져오기
		elif(value['div'] == 'jetfan_way'):
			url = 'http://api.jetfan.ga:5007/jetfan-way/' + value['tunn_code'] + '/' + value['jetfan_way']
			r = requests.get(url)
			jetfan = json.loads(r.text)

			for item in jetfan:
				dataArr.append(item['jetfan_no'])
				dataArr.append(item['jetfan_code'])
				
		return json.dumps(dataArr)