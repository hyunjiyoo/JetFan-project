from flask.views import MethodView
from flask import render_template

import requests, datetime
import json


base_url = 'http://api.jetfan.ga:5005/'

# 데이터생성 
class Basic(MethodView):
	def get(self):
		div_r = requests.get(base_url + 'division')
		bran_r = requests.get(base_url + 'branch/bran_div_code/11')
		tunn_r = requests.get(base_url + 'tunnel/tunn_bran_code/11')
		depts = json.loads(div_r.text)
		brans = json.loads(bran_r.text)
		tunns = json.loads(tunn_r.text)

		years = []
		year = datetime.date.today().year + 1
		for i in range(year-2020):
			years.append(year-i)

		return render_template('basic.html', depts=depts,
												brans=brans,
												tunns=tunns,
												years= years)

