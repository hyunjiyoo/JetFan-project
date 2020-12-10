from flask.views import MethodView
from flask import render_template

import requests
import json

# 추적도면 route
class Trace(MethodView):
	def get(self):
		return render_template('trace.html', credit='')

class Trace2(MethodView):
	def get(self):
		return render_template('test.html', credit='')