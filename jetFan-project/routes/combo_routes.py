from flask.views import MethodView
from flask import request

import requests
import json

# 콤보박스
class Combo(MethodView):
	def post(self):
		if request.method == 'POST':
			dataArr = []
			value = request.get_json()
			
			if(value['div'] == 'branch'):
				r = requests.get('http://api.jetfan.ga:5007/branch/bran_div_code/' + value['div_code'])
				branch = json.loads(r.text)

				for item in branch:
					dataArr.append(item['bran_name'])
					dataArr.append(item['bran_code'])

			elif(value['div'] == 'tunnel'):
				r = requests.get('http://api.jetfan.ga:5007/tunnel/tunn_bran_code/' + value['div_code'])
				tunnel = json.loads(r.text)

				for item in tunnel:
					dataArr.append(item['tunn_name'])
					dataArr.append(item['tunn_code'])

			elif(value['div'] == 'jetfan_way'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan/tunn_code/' + value['div_code'])
				jetfan = json.loads(r.text)

				for item in jetfan:
					dataArr.append(item['jetfan_way'])
				dataArr = list(set(dataArr))

			elif(value['div'] == 'jetfan_no'):
				r = requests.get('http://api.jetfan.ga:5007/jetfan/tunn_code/' + value['div_code'])
				jetfan = json.loads(r.text)

				for item in jetfan:
					dataArr.append(item['jetfan_no'])
					dataArr.append(item['jetfan_way'])
					dataArr.append(item['jetfan_code'])
					dataArr.append(item['jetfan_diagram'])

			return json.dumps(dataArr)