window.onload = () => {
    const permission = parseInt(sessionStorage.permission);
    const supervisor = displaySupervisor(permission);
    if(!supervisor) {
        document.querySelector('#submitBtn').addEventListener('click', createData);
    }
}


// 탭 선택
const openOption = (evt, option) => {
    var i, tabcontent, tablinks;
    
    tabcontent = document.querySelectorAll(".tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    tablinks = document.querySelectorAll(".tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(option).style.display = "block";
    evt.currentTarget.className += " active";
}


// 초기화
const init = (target) => {
    const opt = document.querySelectorAll(`#${target} option`);
    if(opt.length) {
        for(let i = opt.length-1; i >= 0; i--) {
            opt[i].remove();
        }
    }
}


// 본부선택시 지사세팅
const setBranch = () => {
    init('branch'); init('tunns');

    const data = { 'div_code': document.querySelector(`#depts`).value, 'div': 'branch'};

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);

            if(data.hasOwnProperty('err_msg')) {
                Swal.fire({
                    title: '데이터조회실패', 
                    text: data.err_msg,
                    icon: 'warning',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
                return false;
            }

            for(let i = 0; i < data['bran_code'].length; i++) {
                let opt = document.createElement('option');
                document.querySelector(`#branch`).appendChild(opt);
                opt.innerText = data['bran_name'][i];
                opt.value = data['bran_code'][i];
            }
            
            if(document.querySelector(`#tunns option`) === null) {
                for(let i = 0; i < data['tunn_code'].length; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#tunns`).appendChild(opt);
                    opt.innerText = data['tunn_name'][i];
                    opt.value = data['tunn_code'][i];
                }
            }

        }
    }

    xhttp.open("POST", "/basic", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', localStorage.getItem('token'));
    xhttp.send(JSON.stringify(data));
}



// 지사선택시 터널세팅
const setTunnel = () => {
    init('tunns');

    const data = { 'div_code': document.querySelector(`#branch`).value, 'div': 'tunnel'};
    console.log('data :>> ', data);

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);

            if(data.hasOwnProperty('err_msg')) {
                Swal.fire({
                    title: '데이터조회실패', 
                    text: data.err_msg,
                    icon: 'warning',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
                return false;
            }
            
            console.log('data :>> ', data);

            for(let i = 0; i < data['tunn_code'].length; i++) {
                let opt = document.createElement('option');
                document.querySelector(`#tunns`).appendChild(opt);
                opt.innerText = data['tunn_name'][i];
                opt.value = data['tunn_code'][i];
            }
            
        } else if(this.status == 406) {
            Swal.fire({
                title: '데이터 누락', 
                text: '제트팬 정보가 존재하지 않습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
            return false;
            
        } else if(this.status === 500) {
            Swal.fire({
                title: '응답실패', 
                text: '해당 데이터가 없습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
            return false;
        }
    }

    xhttp.open("POST", "/basic", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 데이터 생성시 이미지 복사 
const copyImage = () => {
    
    const year = document.querySelectorAll('.year')[0].selectedOptions[0].textContent;
    const data = {'year': year};

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(this.responseText);
            
            if(data.succ === 200) {
                Swal.fire({
                    title: '데이터 생성 성공', 
                    text: '데이터가 정상적으로 생성되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
            } 

        } else if(this.status == 406) {
            Swal.fire({
                title: '데이터 누락', 
                text: '제트팬 정보가 존재하지 않습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
            return false;
            
        } else if(this.status === 500) {
            Swal.fire({
                title: '응답실패', 
                text: '해당 데이터가 없습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
            return false;
        }
    }

    xhttp.open("POST", "/copyImage", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


const createData = () => {
    const div = document.querySelector('.active').dataset.div;
    const dept_code = document.querySelector('#div_depts').value;
    const tunn_code = document.querySelector('#tunns').value;
    const year = document.querySelectorAll('.year')[0].selectedOptions[0].textContent;
    const emp = document.querySelector('.emp').textContent;

    let data = {
        'div': div,
        'year': year,
        'emp': emp
    };

    if(div === 'division') {
        data.code = dept_code;
    } else {
        data.code = tunn_code;
    }

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);

            if(data.hasOwnProperty('err_msg')) {
                Swal.fire({
                    title: '데이터생성실패', 
                    text: data.err_msg,
                    icon: 'warning',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
                return false;
            };

            copyImage();

        } else if(this.status == 406) {
            Swal.fire({
                title: '데이터 누락', 
                text: '제트팬 정보가 존재하지 않습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
            return false;
            
        } else if(this.status === 500) {
            Swal.fire({
                title: '응답실패', 
                text: '해당 데이터가 없습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
            return false;
        }
    }

    xhttp.open("POST", "/create", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}