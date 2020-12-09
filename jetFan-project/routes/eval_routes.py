from flask.views import MethodView
from flask import render_template

import requests
import json

# 평가표 
class Eval(MethodView):
	def get(self):
		r = requests.get('https://api.fureweb.com/spreadsheets/1cVSi29-wfHDJSdtY5o6l1Yhe5Uz370neYaRX8hJH6NA')
		headquater = json.loads(r.text)

		r = requests.get('https://api.fureweb.com/spreadsheets/1zsZaIp1cu1xzgup6OqA4CFXRmLBOjbnP3htxEdUrsa8')
		tunnel = json.loads(r.text)

		data={'headquater': headquater['data'],
			  'tunnel': tunnel['data']}

		return render_template('standardEval.html', data=data)