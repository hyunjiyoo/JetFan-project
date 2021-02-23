window.onload = () => {
    const permission = parseInt(sessionStorage.permission);
    const supervisor = displaySupervisor(permission);
    if(!supervisor) {
        const submitBtn = document.querySelector('#submitBtn');
        submitBtn.addEventListener('click', modifyData);
    } 

    const accs = document.querySelectorAll(".accordion");
    accs.forEach( acc => {
        acc.addEventListener("click", function() {
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        });
    });
}

// 데이터 초기화
const initData = () => {
    document.querySelector('#tunn_name').innerText = '';
    document.querySelector('#way1').innerText = '';
    document.querySelector('#way2').innerText = '';
    document.querySelector('#way1_jetfan').innerText = '';
    document.querySelector('#way2_jetfan').innerText = '';
    document.querySelector('#tunn_spec').innerText = '';
    document.querySelector('#ins_company').innerText = '';
    document.querySelector('#ins_emp').innerText = '';
    document.querySelector('#ins_ymd').innerText = '';

    for(let i = 11; i <=30; i++) {
        document.querySelector(`#ins_${i}a`).value = '';
        document.querySelector(`#ins_${i}b`).value = '';
    }
    
    for(let i = 1; i < 6; i++) {
        document.querySelector(`#ins_etc${i}`).value = '';
    }  
}


const getData = () => {
    initData();

    let data = {};
    if(document.querySelector('.tab button.active').textContent === '검색') {
        data = {
            'tunn_code': document.querySelector('.non-selected-wrapper a.selected').dataset.value,
            'year': document.querySelector('#search_year').value, 
            'year_no': document.querySelector('#search_update').value
        };
    } else {
        data = {
            'tunn_code': document.querySelector('#tunnel').value,
            'year': document.querySelector('#year').value, 
            'year_no': document.querySelector('#update').value
        };
    }

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
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

            changeCircleColor(data['ins_update']);

            document.querySelector('#tunn_name').innerText = data['tunn_name'] ?? '';
            document.querySelector('#way1').innerText = data['tunn_way1'] ?? '';
            document.querySelector('#way2').innerText = data['tunn_way2'] ?? '';
            document.querySelector('#way1_jetfan').innerText = data['way1_jetfan'] ?? '';
            document.querySelector('#way2_jetfan').innerText = data['way2_jetfan'] ?? '';
            document.querySelector('#tunn_spec').innerText = data['tunn_spec'] ?? '';
            document.querySelector('#ins_company').innerText = data['ins']['ins_company'] ?? '';
            document.querySelector('#ins_emp').innerText = data['ins']['ins_emp'] ?? '';
            document.querySelector('#ins_ymd').innerText = data['ymd_jetfan'] ?? '';
            
            // 점검내용
            for(let i = 11; i <=30; i++) {
                document.querySelector(`#ins_${i}a`).value = data['ins'][`ins_${i}a`] ?? '';
                document.querySelector(`#ins_${i}b`).value = data['ins'][`ins_${i}b`] ?? '';
            }
            for(let i = 1; i < 6; i++) {
                document.querySelector(`#ins_etc${i}`).value = data['ins'][`ins_etc${i}`] ?? '';
                document.querySelector(`#ins_etc${i}`).style.height = document.querySelector(`#ins_etc${i}`).scrollHeight;;
            }          

        } else if(this.status == 406) {
            Swal.fire({
                title: '데이터 누락', 
                text: '터널 정보가 존재하지 않습니다.',
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

    xhttp.open('POST', '/inspection', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


const modifyData = (e) => {
    
    if(document.querySelector('#tunn_name').textContent === '') {
        Swal.fire({
            title: '사전점검', 
            text: '데이터 조회 후 입력가능합니다.',
            icon: 'info',
            confirmButtonText: '확인',
            onAfterClose: () => window.scrollTo(0,0)
        });
        return false;   
    }

    if(document.querySelector('#ins_ymd').textContent === '') {
        Swal.fire({
            title: '사전점검', 
            text: '평가표관리에서 점검일자를 입력해주세요.',
            icon: 'info',
            confirmButtonText: '확인',
            onAfterClose: () => window.scrollTo(0,0)
        });
        return false; 
    }

    let year = 0; let year_no = 0; let tunn_code = 0;
    if(document.querySelector('.tab button.active').textContent === '검색') {
        year = document.querySelector('#search_year').value;
        year_no = document.querySelector('#search_update').value;
        tunn_code = document.querySelector('.non-selected-wrapper a.selected').dataset.value;

    } else {
        year = document.querySelector('#year').value;
        year_no = document.querySelector('#update').value;
        tunn_code = document.querySelector('#tunnel').value;
    }

    const data = {
        'data': [{
            "ins_tunn_code": tunn_code,
            "ins_year": year,
            "ins_year_no": year_no,
            "ins_update": document.querySelector('#greenCircle').dataset.update,
            "ins_emp": document.querySelector('#ins_emp').textContent,
            "ins_company": document.querySelector('#ins_company').textContent,
            "ins_11a": document.querySelector('#ins_11a').value,
            "ins_11b": document.querySelector('#ins_11b').value,
            "ins_12a": document.querySelector('#ins_12a').value,
            "ins_12b": document.querySelector('#ins_12b').value,
            "ins_13a": document.querySelector('#ins_13a').value,
            "ins_13b": document.querySelector('#ins_13b').value,
            "ins_14a": document.querySelector('#ins_14a').value,
            "ins_14b": document.querySelector('#ins_14b').value,
            "ins_15a": document.querySelector('#ins_15a').value,
            "ins_15b": document.querySelector('#ins_15b').value,
            "ins_16a": document.querySelector('#ins_16a').value,
            "ins_16b": document.querySelector('#ins_16b').value,
            "ins_17a": document.querySelector('#ins_17a').value,
            "ins_17b": document.querySelector('#ins_17b').value,
            "ins_18a": document.querySelector('#ins_18a').value,
            "ins_18b": document.querySelector('#ins_18b').value,
            "ins_19a": document.querySelector('#ins_19a').value,
            "ins_19b": document.querySelector('#ins_19b').value,
            "ins_20a": document.querySelector('#ins_20a').value,
            "ins_20b": document.querySelector('#ins_20b').value,
            "ins_21a": document.querySelector('#ins_21a').value,
            "ins_21b": document.querySelector('#ins_21b').value,
            "ins_22a": document.querySelector('#ins_22a').value,
            "ins_22b": document.querySelector('#ins_22b').value,
            "ins_23a": document.querySelector('#ins_23a').value,
            "ins_23b": document.querySelector('#ins_23b').value,
            "ins_24a": document.querySelector('#ins_24a').value,
            "ins_24b": document.querySelector('#ins_24b').value,
            "ins_25a": document.querySelector('#ins_25a').value,
            "ins_25b": document.querySelector('#ins_25b').value,
            "ins_26a": document.querySelector('#ins_26a').value,
            "ins_26b": document.querySelector('#ins_26b').value,
            "ins_27a": document.querySelector('#ins_27a').value,
            "ins_27b": document.querySelector('#ins_27b').value,
            "ins_28a": document.querySelector('#ins_28a').value,
            "ins_28b": document.querySelector('#ins_28b').value,
            "ins_29a": document.querySelector('#ins_29a').value,
            "ins_29b": document.querySelector('#ins_29b').value,
            "ins_30a": document.querySelector('#ins_30a').value,
            "ins_30b": document.querySelector('#ins_30b').value,
            "ins_etc1": document.querySelector('#ins_etc1').value,
            "ins_etc2": document.querySelector('#ins_etc2').value,
            "ins_etc3": document.querySelector('#ins_etc3').value,
            "ins_etc4": document.querySelector('#ins_etc4').value,
            "ins_etc5": document.querySelector('#ins_etc5').value          
        }]
    };

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
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

            const eval_update = document.querySelector('#greenCircle').dataset.update;
            changeCircleColor(eval_update);
            
            if(data.status.status_code === 200) {

                Swal.fire({
                    title: '입력성공', 
                    text: '데이터가 정상적으로 입력되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });

            } else {
                Swal.fire({
                    title: '입력실패', 
                    text: '데이터 입력에 실패하였습니다.',
                    icon: 'warning',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
            }

        } else if(this.status == 406) {
            Swal.fire({
                title: '데이터 누락', 
                text: '터널 정보가 존재하지 않습니다.',
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
        }
    }

    xhttp.open('PUT', '/inspection', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}