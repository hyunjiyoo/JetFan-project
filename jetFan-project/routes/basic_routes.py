from flask.views import MethodView
from flask import render_template, request, session

import shutil, os
import requests, datetime
import json

from . import Base_url
global base_url
base_url = Base_url.go_url


# 데이터생성
class Basic(MethodView):

	def get(self):
		if 'username' in session:
			div_r = requests.get(base_url + 'division')
			bran_r = requests.get(base_url + 'branch/bran_div_code/11')
			tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/11')
			depts = json.loads(div_r.text)
			brans = json.loads(bran_r.text)
			tunns = json.loads(tunn_r.text)

			years = []
			year = datetime.date.today().year + 2
			for i in range(year-2020):
				years.append(year-i-1)
			
			if session.get('username') is not None:
				emp = str(session.get('username')).strip("(',)")
			else:
				emp = ''

			return render_template('basic.html', 
									depts=depts,
									brans=brans,
									tunns=tunns,
									years= years,
									emp=emp)
		else:
			session.clear()
			return render_template('./login.html')

	def post(self):
		v = request.get_json()
		data = {}

		for prop_name in ['div_code']:
			if(v[prop_name] == ''):
				return '데이터누락', 406

		if(v['div'] == 'branch'):
			bran_r = requests.get(base_url + 'branch/bran_div_code/' + v['div_code'])
			bran_item = json.loads(bran_r.text)
			if(bran_item['status']['status_code'] == 200 and bran_item['status']['error_code'] == 0):
				branName = []; branCode = []
				for bran in bran_item['data']:
					branName.append(bran['bran_name'])
					branCode.append(bran['bran_code'])
				data['bran_name'] = branName
				data['bran_code'] = branCode
			else:
				data['err_msg'] = bran_item['status']['error_msg']
				return json.dumps(data)

			tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/' + str(branCode[0]))
			tunn_item = json.loads(tunn_r.text)
			if(tunn_item['status']['status_code'] == 200 and tunn_item['status']['error_code'] == 0):
				tunnName = []; tunnCode = []
				for tunn in tunn_item['data']:
					tunnName.append(tunn['tunn_name'])
					tunnCode.append(tunn['tunn_code'])
				data['tunn_name'] = tunnName
				data['tunn_code'] = tunnCode
			else:
				data['err_msg'] = tunn_item['status']['error_msg']

			return json.dumps(data)	

		elif(v['div'] == 'tunnel'):
			tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/' + v['div_code'])
			tunn_item = json.loads(tunn_r.text)
			if(tunn_item['status']['status_code'] == 200 and tunn_item['status']['error_code'] == 0):
				tunnName = []; tunnCode = []
				
				for tunn in tunn_item['data']:
					tunnName.append(tunn['tunn_name'])
					tunnCode.append(tunn['tunn_code'])

				data['tunn_name'] = tunnName
				data['tunn_code'] = tunnCode
			else:
				data['err_msg'] = tunn_item['status']['error_msg']

		return json.dumps(data)

class CreateData(MethodView):
	def post(self):
		data = {}
		v = request.get_json()

		for prop_name in ['div', 'code', 'year', 'emp']:
			if(v[prop_name] == ''):
				return '데이터누락', 406

		r = requests.post(base_url + 'basic/' + v['div'] + '/' + v['code'] + '/' + v['year'] + '/' + v['emp'])
		result = json.loads(r.text)

		if(result['status']['status_code'] == 200 and result['status']['status_code'] == 200):
			if(result['status']['cnt'] != 0):
				return json.dumps('ok')
			else:
				data['err_msg'] = result['status']['error_msg']
				return json.dumps(data)
		else:
			data['err_msg'] = result['status']['error_msg']
			return json.dumps(data)


class CopyImage(MethodView):
	def post(self):
		v = request.get_json()

		if(v['year'] == ''):
			return '데이터누락', 406

		prev_year = str(int(v['year']) - 1)
		curr_year = str(v['year'])

		if(os.path.isdir('./static/data/abnormal/' + curr_year)):
			pass
		else:
			shutil.copytree('./static/data/abnormal/' + prev_year, './static/data/abnormal/' + curr_year) 
			shutil.copytree('./static/data/jetfan/' + prev_year, './static/data/jetfan/' + curr_year) 
			shutil.copytree('./static/data/photo/' + prev_year, './static/data/photo/' + curr_year) 
			shutil.copytree('./static/data/tunnel/' + prev_year, './static/data/tunnel/' + curr_year) 
		
		return json.dumps({'succ': 200})