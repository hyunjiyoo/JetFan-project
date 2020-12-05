from flask import Flask, request, jsonify, render_template
# from jinja2 import Template

import requests
import json

# app = Flask (__name__, static_url_path="", static_folder="/static/")
app = Flask (__name__)
app.config['JSON_AS_ASCII'] = False
 
@app.route('/')
def hello_world():
    return render_template('./index.html')
    # return Template().render('./index.html')
 
@app.route('/user')
def hello_user():
    return 'Hello, User! Flask'

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