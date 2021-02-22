from flask.views import MethodView
from flask import request

import requests
import json

from . import Base_url
global base_url
base_url = Base_url.go_url


# 콤보박스
class Combo(MethodView):
	def post(self):
		data = {}
		value = request.get_json()

		# 터널명 검색
		if(value['div'] == 'tunn_search'):
			tunn_r = requests.get(base_url + 'tunnel/tunn_code/' + value['tunn_code'])
			tunn_result = json.loads(tunn_r.text)

			tunn_way1 = tunn_result['data'][0]['tunn_way1']
			jetfan_r = requests.get(base_url + 'jetfan-way/' + value['tunn_code'] + '/' + tunn_way1) 
			jetfan_result = json.loads(jetfan_r.text)

			# 방향, 제트팬 데이터
			if(tunn_result['status']['status_code'] == 200 and tunn_result['status']['error_code'] == 0):
				data['tunn_way1'] = tunn_result['data'][0]['tunn_way1']
				data['tunn_way2'] = tunn_result['data'][0]['tunn_way2']

				if(jetfan_result['status']['status_code'] == 200 and jetfan_result['status']['error_code'] == 0):
					jetfanNo = []; jetfanCode = []
					for item in jetfan_result['data']:
						jetfanNo.append(item['jetfan_no'])
						jetfanCode.append(item['jetfan_code'])
					data['jetfan_no'] = jetfanNo
					data['jetfan_code'] = jetfanCode

				else:
					data['err_msg'] = jetfan_result['status']['error_msg']
					return json.dumps(data)

			else:
				data['err_msg'] = tunn_result['status']['error_msg']
				return json.dumps(data)


		# 본부 클릭
		elif(value['div'] == 'branch'):
			bran_r = requests.get(base_url + 'branch/bran_div_code/' + value['div_code'])
			bran_result = json.loads(bran_r.text)

			tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/' + str(bran_result['data'][0]['bran_code']))
			tunn_result = json.loads(tunn_r.text)
		
			# 지사
			if(bran_result['status']['status_code'] == 200 and bran_result['status']['error_code'] == 0):
				branName = []; branCode = []
				for item in bran_result['data']:
					branName.append(item['bran_name'])
					branCode.append(item['bran_code'])
				data['bran_name'] = branName
				data['bran_code'] = branCode

			else:
				data['err_msg'] = bran_result['status']['error_msg']
				return json.dumps(data)
			

			# 터널, 방향, 제트팬
			if(tunn_result['status']['status_code'] == 200 and tunn_result['status']['error_code'] == 0):
				tunnName = []; tunnCode = []
				for item in tunn_result['data']:
					tunnName.append(item['tunn_name'])
					tunnCode.append(item['tunn_code'])
				data['tunn_name'] = tunnName
				data['tunn_code'] = tunnCode

				if(tunn_result['data'][0]['tunn_way1'] is not None):
					data['tunn_way1'] = tunn_result['data'][0]['tunn_way1']
					data['tunn_way2'] = tunn_result['data'][0]['tunn_way2']
					
					tunn_code = str(tunn_result['data'][0]['tunn_code'])
					tunn_way1 = tunn_result['data'][0]['tunn_way1']
					jetfan_r = requests.get(base_url + 'jetfan-way/' + tunn_code + '/' + tunn_way1)
					jetfan_result = json.loads(jetfan_r.text)

					if(jetfan_result['status']['status_code'] == 200 and jetfan_result['status']['error_code'] == 0):
						jetfanNo = []; jetfanCode = []
						for item in jetfan_result['data']:
							jetfanNo.append(item['jetfan_no'])
							jetfanCode.append(item['jetfan_code'])
						data['jetfan_no'] = jetfanNo
						data['jetfan_code'] = jetfanCode

					else:
						data['err_msg'] = jetfan_result['status']['error_msg']
						return json.dumps(data)

			else:
				data['err_msg'] = tunn_result['status']['error_msg']
				return json.dumps(data)

			
		# 지사 클릭
		elif(value['div'] == 'tunnel'):
			r = requests.get(base_url + 'tunnel/tunn_bran_code/' + value['div_code'])
			tunn_result = json.loads(r.text)

			if(tunn_result['status']['status_code'] == 200 and tunn_result['status']['error_code'] == 0):
				tunnName = []; tunnCode = []
				for item in tunn_result['data']:
					tunnName.append(item['tunn_name'])
					tunnCode.append(item['tunn_code'])
				data['tunn_name'] = tunnName
				data['tunn_code'] = tunnCode

				if(tunn_result['data'][0]['tunn_way1'] is not None):
					data['tunn_way1'] = tunn_result['data'][0]['tunn_way1']
					data['tunn_way2'] = tunn_result['data'][0]['tunn_way2']

					tunn_code = str(tunn_result['data'][0]['tunn_code'])
					tunn_way1 = tunn_result['data'][0]['tunn_way1']
					jetfan_r = requests.get(base_url + 'jetfan-way/' + tunn_code + '/' + tunn_way1)
					jetfan_result = json.loads(jetfan_r.text)

					if(jetfan_result['status']['status_code'] == 200 and jetfan_result['status']['error_code'] == 0):
						jetfanNo = []; jetfanCode = []
						for item in jetfan_result['data']:
							jetfanNo.append(item['jetfan_no'])
							jetfanCode.append(item['jetfan_code'])
						data['jetfan_no'] = jetfanNo
						data['jetfan_code'] = jetfanCode

					else:
						data['err_msg'] = jetfan_result['status']['error_msg']
						return json.dumps(data)

			else:
				data['err_msg'] = tunn_result['status']['error_msg']
				return json.dumps(data)



		# 터널 클릭
		elif(value['div'] == 'jetfan_no'):
			tunn_r = requests.get(base_url + 'tunnel/tunn_code/' + value['tunn_code'])
			tunn_result = json.loads(tunn_r.text)

			# 본부
			data['div_code'] = tunn_result['data'][0]['div_code']

			# 지사, 방향
			div_code = str(tunn_result['data'][0]['div_code'])
			branch_r = requests.get(base_url + 'branch/bran_div_code/' + div_code)
			bran_result = json.loads(branch_r.text)
			if(bran_result['status']['status_code'] == 200 and bran_result['status']['error_code'] == 0):
				branName = []; branCode = []
				for item in bran_result['data']:
					branName.append(item['bran_name'])
					branCode.append(item['bran_code'])
				data['bran_name'] = branName
				data['bran_code'] = branCode
				data['select_bran_code'] = tunn_result['data'][0]['bran_code']

				data['tunn_way1'] = tunn_result['data'][0]['tunn_way1']
				data['tunn_way2'] = tunn_result['data'][0]['tunn_way2']

			else:
				data['err_msg'] = bran_result['status']['error_msg']
				return json.dumps(data)

			# 제트팬

			jetfan_r = requests.get(base_url + 'jetfan-way/' + value['tunn_code'] + '/' + data['tunn_way1'])
			jetfan_result = json.loads(jetfan_r.text)

			if(jetfan_result['status']['status_code'] == 200 and jetfan_result['status']['error_code'] == 0):
				jetfanNo = []; jetfanCode = []
				for item in jetfan_result['data']:
					jetfanNo.append(item['jetfan_no'])
					jetfanCode.append(item['jetfan_code'])
				data['jetfan_no'] = jetfanNo
				data['jetfan_code'] = jetfanCode
			
			else:
				data['err_msg'] = jetfan_result['status']['error_msg']
				return json.dumps(data)
			
		
		# 방향 클릭
		elif(value['div'] == 'jetfan_way'):
			url = base_url + 'jetfan-way/' + value['tunn_code'] + '/' + value['jetfan_way']
			r = requests.get(url)
			jetfan_result = json.loads(r.text)

			# 제트팬
			if(jetfan_result['status']['status_code'] == 200 and jetfan_result['status']['error_code'] == 0):
				jetfanNo = []; jetfanCode = []
				for item in jetfan_result['data']:
					jetfanNo.append(item['jetfan_no'])
					jetfanCode.append(item['jetfan_code'])
				data['jetfan_no'] = jetfanNo
				data['jetfan_code'] = jetfanCode
			
			else:
				data['err_msg'] = jetfan_result['status']['error_msg']
				return json.dumps(data)
				

		return json.dumps(data)