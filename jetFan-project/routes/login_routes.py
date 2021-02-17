from flask.views import MethodView
from flask import render_template, request, session

import datetime
import requests
import json

# from passlib.hash import sha256_crypt
# import jwt

from . import Base_url
global base_url
base_url = Base_url.go_url


class Register(MethodView):
    def get(self):
        return render_template('register.html')

    def post(self):
        v = request.get_json()
        # 이메일과 패스워드 받아서 DB에 INSERT하는 API 콜 
        # v['email'], v['passwd']

        # 콜 응답이 정상적으로 되면 return
        return json.dumps({'code': 200})
        # 정상이 아니면, 중복되면 중복코드 리턴



class Login(MethodView):
    def get(self):
        return render_template('login.html')

    def post(self):
        v = request.get_json()

        r = requests.get(base_url + 'login/' + v['email'])
        result = json.loads(r.text)

        # encrypted_pass = sha256_crypt.encrypt(v['passwd'])
        # chk_passwd = sha256_crypt.verify(v['passwd'], result['data'][0]['passwd'])

        if(v['passwd'] == result['data'][0]['passwd']):
            session.clear()
            session['email'] = v['email']
            session['username'] = result['data'][0]['user_name'],
            session['permission'] = result['data'][0]['permission'],

            session_data =  {
                'email': v['email'],
                'username': result['data'][0]['user_name'],
                'permission': result['data'][0]['permission']
            }

            return json.dumps(session_data)
        
        else:
            return json.dumps({'msg': '비밀번호가 일치하지 않습니다.'})


class Logout(MethodView):
    def post(self):
        session.clear()
        return json.dumps({'code': 200})