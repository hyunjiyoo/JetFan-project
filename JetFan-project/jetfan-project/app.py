from flask import Flask, request, jsonify, render_template
# from jinja2 import Template

import requests
import json

app = Flask (__name__, static_url_path="", static_folder="static")
app.config['JSON_AS_ASCII'] = False
 
@app.route('/')
def home():
    return render_template('./index.html')
 
@app.route('/user')
def hello_user():
    return 'Hello, User! Flask'

@app.route('/standardEval')
def standardEval():
	return render_template('./standardEval.html')

@app.route('/safetyChk')
def safetyChk():
	return render_template('./safetyChk.html')
	
@app.route('/tracePlan')
def tracePlan():
	return render_template('./tracePlan.html')

@app.route('/errorReport')
def errorReport():
	return render_template('./errorReport.html')

@app.route('/album')
def album():
	return render_template('./album.html')

@app.route('/createData')
def createData():
	return render_template('./createData.html')







# test 테이블
@app.route('/test')	
def test():
	r = requests.get('https://api.fureweb.com/spreadsheets/1qQtSrqa7C500EBAr6cMOSfwceybmz3mvQq8Tv2f0CWI')
	js = json.dumps(r.json())
	deptName = json.loads(r.text)

	return deptName['data'][1]['a']
	# return deptName['data'][1]

# 본부 테이블
@app.route('/dept')
def dept():
	r = requests.get('https://api.fureweb.com/spreadsheets/1cVSi29-wfHDJSdtY5o6l1Yhe5Uz370neYaRX8hJH6NA')
	js = json.dumps(r.json())
	deptName = json.loads(r.text)
	return deptName['data'][1]
	# return deptName['data'][1]['본부명']

# 제트팬 테이블
@app.route('/jetfan')
def jetfan():
	r = requests.get('https://api.fureweb.com/spreadsheets/1Ql-5lAL8G-4bTmMZeJbD74G-DI25G3HpQebE04dFBTY')
	js = json.dumps(r.json())
	deptName = json.loads(r.text)
	# return deptName['data'][1]
	return deptName['data'][1]['제트팬관리번호']

# 터널 테이블
@app.route('/tunnel')
def tunnel():
	r = requests.get('https://api.fureweb.com/spreadsheets/1zsZaIp1cu1xzgup6OqA4CFXRmLBOjbnP3htxEdUrsa8')
	js = json.dumps(r.json())
	deptName = json.loads(r.text)
	return deptName['data'][66]
	# return deptName['data'][1]['제트팬관리번호']

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)