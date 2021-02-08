class Base_url:
    url_api = 'http://api.jetfan.ga:5007/'
    url_local = 'http://restx:5000/'
    url_local_old = 'http://restx-old:5000/'

    want_url = 3
    
    if want_url == 1:
        go_url = url_api
    elif want_url == 2:
        go_url = url_local
    elif want_url == 3:
        go_url = url_local_old
    else:
        go_url = url_api