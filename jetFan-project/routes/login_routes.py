from flask.views import MethodView
from flask import render_template, request, session

import requests
import json, hashlib

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

        hass_pass = hashlib.sha256(v['passwd'].encode()).hexdigest()
        login_info = [{
                'passwd': hass_pass,
                'permission': v['permission'],
                'user_name': v['username']
            }]

        url = base_url + 'user/' + v['email']
        r = requests.post(url, data=json.dumps(login_info))
        result = json.loads(r.text)

        return json.dumps(result)



class Login(MethodView):
    def get(self):
        session.clear()
        return render_template('login.html')

    def post(self):
        v = request.get_json()

        r = requests.get(base_url + 'user/' + v['email'])
        result = json.loads(r.text)

        hass_pass = hashlib.sha256(v['passwd'].encode()).hexdigest()

        if(hass_pass == result['data'][0]['passwd']):
            session.clear()
            session['email'] = v['email']
            session['username'] = result['data'][0]['user_name'],
            session['permission'] = result['data'][0]['permission'],

            data =  {
                'code': 200,
                'email': v['email'],
                'username': result['data'][0]['user_name'],
                'permission': result['data'][0]['permission']
            }

            return json.dumps(data)
        
        else:
            return json.dumps({'code': 401})


class Logout(MethodView):
    def post(self):
        session.clear()
        return json.dumps({'code': 200})