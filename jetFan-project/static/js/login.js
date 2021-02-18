window.onload = () => {
    sessionStorage.clear();
}


const verify = (email, passwd, confirmPass = passwd) => {
    document.querySelector('#msg').innerText = '';

    if(email === '' || passwd === '' || confirmPass === '') {
        Swal.fire({
            title: '사전점검', 
            text: '정보를 모두 입력해주세요.',
            icon: 'info',
            confirmButtonText: '확인',
        });

        return false;
    }

    // 이메일 검증
    const atposition = email.indexOf("@");  
    const dotposition = email.lastIndexOf(".");  
    
    if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= email.length) {  
        document.querySelector('#msg').innerText = '이메일 형식이 맞지 않습니다.';
        return false;
    }  
    
    // 비밀번호 검증
    if(confirmPass && (passwd !== confirmPass)) {
        document.querySelector('#msg').innerText = '비밀번호가 서로 다릅니다.';
        return false;
    }
}


const register = () => {
    const email = document.querySelector('#email').value;
    const passwd = document.querySelector('#passwd').value;
    const confirmPasswd = document.querySelector('#confirmPasswd').value;

    verify(email, passwd, confirmPasswd);

    const data = {
        'email': email,
        'passwd': passwd
    };

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(this.responseText);
            console.log('this.responseText :>> ', this.responseText);

            if(data.code === 200) {
                Swal.fire({
                    title: '등록성공', 
                    text: '제트팬회원이 되신 것을 축하드립니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                }).then(() => {
                    location.href = './login';
                });

            } else {
                Swal.fire({
                    title: '등록실패', 
                    text: '이미 존재하는 아이디 입니다.',
                    icon: 'info',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                })
            }

        } else if(this.status === 500) {
            Swal.fire({
                title: '등록실패', 
                text: '등록 정보를 다시 확인해주세요.',
                icon: 'info',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
            return false;
            
        } 
    }

    xhttp.open("POST", "/register", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


const login = () => {
    const email = document.querySelector('#email').value;
    const passwd = document.querySelector('#passwd').value;

    verify(email, passwd);

    const data = {
        'email': email,
        'passwd': passwd
    };

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            if(data.code === 200) {
                sessionStorage.setItem('email', data['email']);
                sessionStorage.setItem('username', data['username']);
                sessionStorage.setItem('permission', data['permission']);
                location.href = './';

            } else {
                document.querySelector('#msg').innerText = '비밀번호가 일치하지 않습니다.';
            }

        } else if(this.status === 500) {
            Swal.fire({
                title: '로그인실패', 
                text: '로그인 정보를 다시 확인해주세요.',
                icon: 'info',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
            return false;
            
        } 
    }

    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}