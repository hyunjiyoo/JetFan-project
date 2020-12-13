from flask.views import MethodView
from flask import render_template

import requests
import json

# API TEST route
class TestUser(MethodView):
	def get(self):
		return 'Hello, User!'

class TestTest(MethodView):
	def get(self):
	# r = requests.get('https://api.fureweb.com/spreadsheets/1qQtSrqa7C500EBAr6cMOSfwceybmz3mvQq8Tv2f0CWI')
	# print ('aa')
	# print(type(js))
	# # return r.text
	# # return r.json()
	# deptName = json.loads(r.text)
	# return deptName['data'][1]['a']

		r = requests.get('https://api.fureweb.com/spreadsheets/1qQtSrqa7C500EBAr6cMOSfwceybmz3mvQq8Tv2f0CWI')
		js = json.dumps(r.json())
		deptName = json.loads(r.text)

		return deptName['data'][1]['a']


# 본부 테이블
class TestDept(MethodView):
	def get(self):
		r = requests.get('https://api.fureweb.com/spreadsheets/1cVSi29-wfHDJSdtY5o6l1Yhe5Uz370neYaRX8hJH6NA')
		js = json.dumps(r.json())
		deptName = json.loads(r.text)
		return deptName['data'][1]
		# return deptName['data'][1]['본부명']

# 제트팬 테이블
class TestJetfan(MethodView):
	def get(self):
		r = requests.get('https://api.fureweb.com/spreadsheets/1Ql-5lAL8G-4bTmMZeJbD74G-DI25G3HpQebE04dFBTY')
		js = json.dumps(r.json())
		deptName = json.loads(r.text)
		# return deptName['data'][1]
		return deptName['data'][1]['제트팬관리번호']

# 터널 테이블
class TestTunnel(MethodView):
	def get(self):
		r = requests.get('https://api.fureweb.com/spreadsheets/1zsZaIp1cu1xzgup6OqA4CFXRmLBOjbnP3htxEdUrsa8')
		js = json.dumps(r.json())
		deptName = json.loads(r.text)
		return deptName['data'][66]
		# return deptName['data'][1]['제트팬관리번호']
