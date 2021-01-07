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
		
		# 터널명 검색
		if(value['div'] == 'tunn_search'):
			r = requests.get(base_url + 'tunnel-search/' + value['div_code'])
			items = json.loads(r.text)

			tunnel = []
			for item in items:
				tunnel.append(item['tunn_name'])
				tunnel.append(item['tunn_code'])
			dataArr.append(tunnel)


		# 본부 클릭
		elif(value['div'] == 'branch'):
			bran_r = requests.get(base_url + 'branch/bran_div_code/' + value['div_code'])
			branch = json.loads(bran_r.text)
			tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/' + str(branch[0]['bran_code']))
			tunn = json.loads(tunn_r.text)
			
			branArr = []
			for item in branch:
				branArr.append(item['bran_name'])
				branArr.append(item['bran_code'])
			
			tunnArr = []
			for item in tunn:
				tunnArr.append(item['tunn_name'])
				tunnArr.append(item['tunn_code'])
			
			dataArr.append(branArr)
			dataArr.append(tunnArr)
			dataArr.append(tunn[0]['tunn_way1'])
			dataArr.append(tunn[0]['tunn_way2'])


		# 지사 클릭
		elif(value['div'] == 'tunnel'):
			r = requests.get(base_url + 'tunnel/tunn_bran_code/' + value['div_code'])
			tunnel = json.loads(r.text)

			for item in tunnel:
				dataArr.append(item['tunn_name'])
				dataArr.append(item['tunn_code'])


		# 터널 클릭
		elif(value['div'] == 'jetfan_no'):
			way_r = requests.get(base_url + 'tunnel/tunn_code/' + value['div_code'])
			jetfan_r = requests.get(base_url + 'jetfan/tunn_code/' + value['div_code'])
			way = json.loads(way_r.text)
			jetfan = json.loads(jetfan_r.text)

			# 제트팬
			jetfanArr = []
			for item in jetfan:
				jetfanArr.append(item['jetfan_no'])
				jetfanArr.append(item['jetfan_code'])
			dataArr.append(jetfanArr)

			# 본부
			divArr = []
			divArr.append(jetfan[0]['div_name'])
			divArr.append(jetfan[0]['div_code'])
			dataArr.append(divArr)

			# 지사
			branArr = []
			branArr.append(jetfan[0]['bran_name'])
			branArr.append(jetfan[0]['bran_code'])
			dataArr.append(branArr)
			
			# 방향
			wayArr = []
			wayArr.append(way[0]['tunn_way1'])
			wayArr.append(way[0]['tunn_way2'])
			dataArr.append(wayArr)
			
			
		
		# 방향 클릭
		elif(value['div'] == 'jetfan_way'):
			url = base_url + 'jetfan-way/' + value['tunn_code'] + '/' + value['jetfan_way']
			r = requests.get(url)
			jetfan = json.loads(r.text)

			for item in jetfan:
				dataArr.append(item['jetfan_no'])
				dataArr.append(item['jetfan_code'])
				
		return json.dumps(dataArr)