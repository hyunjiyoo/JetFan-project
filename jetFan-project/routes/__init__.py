class Base_url:
    url_api = 'http://api.jetfan.ga:5007/'
    url_local = 'http://restx:5000/'

    want_url = 1
    
    if want_url == 1:
        go_url = url_api
    elif want_url == 2:
        go_url = url_local
    else:
        go_url = url_api