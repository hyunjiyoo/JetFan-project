from flask.views import MethodView
from flask import render_template

import datetime
import requests
import json

# 평가표 
class Eval(MethodView):
	def get(self):
		r = requests.get('http://api.jetfan.ga:5007/division')
		depts = json.loads(r.text)

		years = []
		year = datetime.date.today().year
		# year = 2023
		for i in range(year+1-2020):
			years.append(year-i)
		years.reverse()

		return render_template('evaluation.html', depts=depts, years= years)
	
	# def post(self):
