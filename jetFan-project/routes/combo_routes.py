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
			tunn_r = requests.get(base_url + 'tunnel-search/' + value['div_code'])
			tunn_items = json.loads(tunn_r.text)
			
			div_r = requests.get(base_url + 'division')
			div_items = json.loads(div_r.text)

			bran_r = requests.get(base_url + 'branch/bran_div_code/' + str(tunn_items[0]['tunn_div_code']))
			bran_items = json.loads(bran_r.text)

			jetfan_r = requests.get(base_url + 'jetfan-way/' + str(tunn_items[0]['tunn_code']) + '/' + tunn_items[0]['tunn_way1']) 
			jetfan_items = json.loads(jetfan_r.text)

			divArr = []
			for item in div_items:
				divArr.append(item['div_name'])
				divArr.append(item['div_code'])

			branArr = []
			for item in bran_items:
				branArr.append(item['bran_name'])
				branArr.append(item['bran_code'])

			tunnel = []
			for item in tunn_items:
				tunnel.append(item['tunn_name'])
				tunnel.append(item['tunn_code'])
			
			wayArr = []
			wayArr.append(tunn_items[0]['tunn_way1'])
			wayArr.append(tunn_items[0]['tunn_way2'])

			jetfanArr = []
			for item in jetfan_items:
				jetfanArr.append(item['jetfan_no'])
				jetfanArr.append(item['jetfan_code'])


			tunnInfo = []
			tunnInfo.append(tunn_items[0]['tunn_div_code'])
			tunnInfo.append(tunn_items[0]['tunn_bran_code'])


			dataArr.append(divArr)
			dataArr.append(branArr)
			dataArr.append(tunnel)
			dataArr.append(wayArr)
			dataArr.append(jetfanArr)
			dataArr.append(tunnInfo)


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
			
			wayArr = []
			wayArr.append(tunn[0]['tunn_way1'])
			wayArr.append(tunn[0]['tunn_way2'])

			dataArr.append(branArr)
			dataArr.append(tunnArr)
			dataArr.append(wayArr)


		# 지사 클릭
		elif(value['div'] == 'tunnel'):
			r = requests.get(base_url + 'tunnel/tunn_bran_code/' + value['div_code'])
			tunnel = json.loads(r.text)
			jetfan_r = requests.get(base_url + 'jetfan-way/' + str(tunnel[0]['tunn_code']) + '/' + tunnel[0]['tunn_way1'])
			jetfan = json.loads(jetfan_r.text)

			tunnArr = []
			for item in tunnel:
				tunnArr.append(item['tunn_name'])
				tunnArr.append(item['tunn_code'])
			
			wayArr = []
			wayArr.append(tunnel[0]['tunn_way1'])
			wayArr.append(tunnel[0]['tunn_way2'])

			jetfanArr = []
			for item in jetfan:
				jetfanArr.append(item['jetfan_no'])
				jetfanArr.append(item['jetfan_code'])

			dataArr.append(tunnArr)
			dataArr.append(wayArr)
			dataArr.append(jetfanArr)



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