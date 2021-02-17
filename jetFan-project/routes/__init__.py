class Base_url:
    url_api = 'http://api.jetfan.ga:5005/'
    url_local = 'http://restx:5000/'
    url_local_old = 'http://restx-old:5000/'

    want_url = 1
    
    if want_url == 1:
        go_url = url_api
    elif want_url == 2:
        go_url = url_local
    elif want_url == 3:
        go_url = url_local_old
    else:
        go_url = url_api


# from flask import request, Response
# import jwt, json

# from functools import wraps


# def login_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         access_token = request.headers.get("Authorization")
#         if access_token is not None:
#             try:
#                 payload = jwt.decode(access_token, 'secret', "HS256")
#             except jwt.InvalidTokenError:
#                 payload = None

#             # return json.dumps(payload)
            
#             if payload is None:
#                 return Response(status=401)

            
#             user_email = payload["email"]
#             username = payload["username"]
#             permission = payload["permission"]
            
#             kwargs['email'] = user_email
#             kwargs['username'] = username
#             kwargs['permission'] = permission

#         else:
#             return Response(status=401)

#         return f(*args, **kwargs)
    
#     return decorated_function