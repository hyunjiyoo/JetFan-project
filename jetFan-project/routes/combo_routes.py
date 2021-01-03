from flask.views import MethodView
from flask import request

import requests
import json

# 콤보박스
class Combo(MethodView):
	def post(self):
		dataArr = []
		value = request.get_json()
		base_url = 'http://api.jetfan.ga:5007/'
		
		# 터널명 검색했을 때 터널 가져오기
		if(value['div'] == 'tunn_search'):
			r = requests.get(base_url + 'tunnel-search/' + value['div_code'])
			tunnel = json.loads(r.text)

			for item in tunnel:
				dataArr.append(item['tunn_name'])
				dataArr.append(item['tunn_code'])

		# 본부 클릭했을 때 지사 가져오기
		elif(value['div'] == 'branch'):
			r = requests.get(base_url + 'branch/bran_div_code/' + value['div_code'])
			branch = json.loads(r.text)

			for item in branch:
				dataArr.append(item['bran_name'])
				dataArr.append(item['bran_code'])

		# 지사 클릭했을 때 터널 가져오기
		elif(value['div'] == 'tunnel'):
			r = requests.get(base_url + 'tunnel/tunn_bran_code/' + value['div_code'])
			tunnel = json.loads(r.text)

			for item in tunnel:
				dataArr.append(item['tunn_name'])
				dataArr.append(item['tunn_code'])

		# 터널 클릭했을 때 터널방향, 제트팬 가져오기
		elif(value['div'] == 'jetfan_no'):
			way_r = requests.get(base_url + 'tunnel/tunn_code/' + value['div_code'])
			jetfan_r = requests.get(base_url + 'jetfan/tunn_code/' + value['div_code'])
			way = json.loads(way_r.text)
			jetfan = json.loads(jetfan_r.text)
			wayArr = []
			jetfanArr = []

			# 방향가져오기
			wayArr.append(way[0]['tunn_way1'])
			wayArr.append(way[0]['tunn_way2'])

			# 제트팬가져오기
			for item in jetfan:
				jetfanArr.append(item['jetfan_no'])
				jetfanArr.append(item['jetfan_code'])

			dataArr.append(wayArr)
			dataArr.append(jetfanArr)
		
		# 방향 클릭했을 때 제트팬 가져오기
		elif(value['div'] == 'jetfan_way'):
			url = base_url + 'jetfan-way/' + value['tunn_code'] + '/' + value['jetfan_way']
			r = requests.get(url)
			jetfan = json.loads(r.text)

			for item in jetfan:
				dataArr.append(item['jetfan_no'])
				dataArr.append(item['jetfan_code'])
				
		return json.dumps(dataArr)