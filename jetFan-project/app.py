from flask import Flask, request, jsonify, render_template

# Import routes (API test)
from routes.apitest_routes import TestUser
from routes.apitest_routes import TestTest
from routes.apitest_routes import TestDept
from routes.apitest_routes import TestJetfan
from routes.apitest_routes import TestTunnel

from routes.test2_routes import Test2, Test3
# from routes.test2_routes import Test2


## Import routes
# 콤보박스
from routes.combo_routes import Combo
# 평가표 Eval
from routes.eval_routes import Eval
# 추적도면 Trace
from routes.trace_routes import Trace
# 안전점검 Safety 
from routes.safety_routes import Safety
# 이상발생보고서 Error
from routes.abnormal_routes import Abnormal
# 사진첩 Album
from routes.album_routes import Album
# 데이터생성 Data
from routes.data_routes import Data

app = Flask (__name__, static_url_path="", static_folder="static")
app.config['JSON_AS_ASCII'] = False

@app.route('/')
def home():
    return render_template('./index.html')

# API Test
app.add_url_rule('/user', view_func=TestUser.as_view('user_view'), methods=['GET'])
app.add_url_rule('/test', view_func=TestTest.as_view('test_view'), methods=['GET'])
app.add_url_rule('/dept', view_func=TestDept.as_view('dept_view'), methods=['GET'])
app.add_url_rule('/jetfan', view_func=TestJetfan.as_view('jetfan_view'), methods=['GET'])
app.add_url_rule('/tunnel', view_func=TestTunnel.as_view('tunnel_view'), methods=['GET'])

# 콤보박스
app.add_url_rule('/combo', view_func=Combo.as_view('combo'), methods=['POST'])
# 평가표
app.add_url_rule('/evaluation', view_func=Eval.as_view('evaluation_view'), methods=['GET', 'POST', 'PUT'])
# 안전점검
app.add_url_rule('/inspection', view_func=Safety.as_view('inspection_view'), methods=['GET', 'POST'])
# 추적도면
app.add_url_rule('/trace', view_func=Trace.as_view('trace_view'), methods=['GET', 'POST', 'PUT'])
# 이상발생보고서
app.add_url_rule('/abnormal', view_func=Abnormal.as_view('abnormal_view'), methods=['GET', 'POST', 'PUT', 'DELETE'])
# 사진첩
app.add_url_rule('/photo', view_func=Album.as_view('photo_view'), methods=['GET', 'POST'])
# 데이터생성
app.add_url_rule('/basic', view_func=Data.as_view('basic_view'), methods=['GET', 'POST'])


app.add_url_rule('/test2', view_func=Test2.as_view('test2_view'), methods=['GET', 'POST'])
# app.add_url_rule('/test2', view_func=Test2.as_view('test3_view'), methods=['GET', 'POST'])
app.add_url_rule('/test3', view_func=Test3.as_view('test3_view'), methods=['POST'])





if __name__ == "__main__":
	app.run(host='0.0.0.0',port=5000,debug=True)