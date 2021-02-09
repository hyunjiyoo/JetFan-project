// 초기화
const init = (target) => {
    const opt = document.querySelectorAll(`#${target} option`);
    if(opt.length) {
        for(let i = opt.length-1; i >= 0; i--) {
            opt[i].remove();
        }
    }
}

const signalInit = () => {
    document.querySelector('#greenCircle').innerText = '○';
    document.querySelector('#redCircle').innerText = '○';
}

// 터널검색 초기화
const searchInit = () => {
    document.querySelector('#tunn_search').value = '';
}


// 터널명 입력했을 때 엔터키로 검색 클릭
const tunnelEnterKeyEvent = (() => {
    document.querySelector('#tunn_search').addEventListener('keypress', (e) => {
        if(e.keyCode === 13) {
            e.preventDefault();
            searchTunnel();
        }
    });
})();



// 터널명 검색했을때 터널 가져오기
const searchTunnel = () => {
    // 아무것도 입력안하고 검색만 클릭했을때
    if(document.querySelector(`#tunn_search`).value === '') {
        location.reload();
    }

    signalInit(); init('dept'); init('branch'); init('tunnel'); init('jetfan_no'); init('jetfan_way');

    const tunn_search = document.querySelector('#tunn_search').value;
    const data = { 'div_code': tunn_search, 'div': 'tunn_search'};
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

            } else {
                // 본부
                const dept = document.querySelector('#dept');
                for(let i = 0; i < data['div_code'].length; i++) {
                    let opt = document.createElement('option');
                    dept.appendChild(opt);
                    opt.innerText = data['div_name'][i];
                    opt.value = data['div_code'][i];
                    if(data['div_code'][i] === data['tunn_div_code']) {
                        opt.selected = true;
                    }
                }

                
                // 지사
                const bran = document.querySelector('#branch');
                for(let i = 0; i < data['bran_code'].length; i++) {
                    let opt = document.createElement('option');
                    bran.appendChild(opt);
                    opt.innerText = data['bran_name'][i];
                    opt.value = data['bran_code'][i];
                    if(data['bran_code'][i] === data['tunn_bran_code']) {
                        opt.selected = true;
                    }
                }


                // 터널
                for(let i = 0; i < data['tunn_code'].length; i++) {
                    let opt = document.createElement('option');
                    document.querySelector('#tunnel').appendChild(opt);
                    opt.innerText = data['tunn_name'][i];
                    opt.value = data['tunn_code'][i];
                }

                const path = window.location.pathname;
                if(path === '/evaluation' || path === '/trace') {
                    // 방향
                    let opt1 = document.createElement('option');
                    let opt2 = document.createElement('option');
                    document.querySelector(`#jetfan_way`).appendChild(opt1);
                    document.querySelector(`#jetfan_way`).appendChild(opt2);
                    opt1.innerText = data['tunn_way1'];
                    opt2.innerText = data['tunn_way2'];
        
                    // 제트팬
                    for(let i = 0; i < data['jetfan_code'].length; i++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#jetfan_no`).appendChild(opt);
                        opt.innerText = data['jetfan_no'][i];
                        opt.value = data['jetfan_code'][i];
                    }
                }

                // 터널 콤보박스 클릭이벤트 넣어줘야함.
                // 모달창 띄워서 비슷한 효과
                // document.querySelector('#tunnClick').addEventListener('mousedown', function(event) {
                //     var evt = event;
                //     setTimeout(() => {
                //         document.querySelector('#tunnel').dispatchEvent(evt);
                //     });
                // });
                // document.querySelector('#tunnClick').click();
            }
            

        } else if(this.status === 500) {
            Swal.fire({
                title: '검색실패', 
                text: '해당 데이터가 존재하지 않습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
        }
    }

    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 본부선택시 지사세팅
const setBranch = () => {
    signalInit(); searchInit(); 
    init('branch'); init('tunnel'); init('jetfan_no'); init('jetfan_way');

    const data = { 'div_code': document.querySelector(`#dept`).value, 'div': 'branch'};

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

            } else {

                for(let i = 0; i < data['bran_code'].length; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#branch`).appendChild(opt);
                    opt.innerText = data['bran_name'][i];
                    opt.value = data['bran_code'][i];
                }
                
                if(document.querySelector(`#tunnel option`) === null) {
                    for(let i = 0; i < data['tunn_code'].length; i++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#tunnel`).appendChild(opt);
                        opt.innerText = data['tunn_name'][i];
                        opt.value = data['tunn_code'][i];
                    }
                }
                
                const path = window.location.pathname;
                if(path === '/evaluation' || path === '/trace') {
                    if(data['tunn_way1'] && data['tunn_way2']) {
                        if(document.querySelector(`#jetfan_way option`) === null) {
                            let opt1 = document.createElement('option');
                            let opt2 = document.createElement('option');
                            document.querySelector(`#jetfan_way`).appendChild(opt1);
                            document.querySelector(`#jetfan_way`).appendChild(opt2);
                            opt1.innerText = data['tunn_way1'];
                            opt2.innerText = data['tunn_way2'];
                        }
                    }
        
                    if(data['jetfan_no'].length) {
                        if(document.querySelector(`#jetfan_no option`) === null) {
                            for(let i = 0; i < data['jetfan_code'].length; i++) {
                                let opt = document.createElement('option');
                                document.querySelector(`#jetfan_no`).appendChild(opt);
                                opt.innerText = data['jetfan_no'][i];
                                opt.value = data['jetfan_code'][i];
                            }
                        }
                    }
                }
            }
            
        } 
    }

    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 지사선택시 터널세팅
const setTunnel = () => {
    signalInit(); searchInit(); init('tunnel'); init('jetfan_way'); init('jetfan_no');

    const data = { 'div_code': document.querySelector(`#branch`).value, 'div': 'tunnel'};
    
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

            } else {

                for(let i = 0; i < data['tunn_code'].length; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#tunnel`).appendChild(opt);
                    opt.innerText = data['tunn_name'][i];
                    opt.value = data['tunn_code'][i];
                }

                const path = window.location.pathname;
                if(path === '/evaluation' || path === '/trace') {
                    if(data['tunn_way1'] && data['tunn_way2']) {
                        if(document.querySelector(`#jetfan_way option`) === null) {
                            let opt1 = document.createElement('option');
                            let opt2 = document.createElement('option');
                            document.querySelector(`#jetfan_way`).appendChild(opt1);
                            document.querySelector(`#jetfan_way`).appendChild(opt2);
                            opt1.innerText = data['tunn_way1'];
                            opt2.innerText = data['tunn_way2'];
                        }
                    }
        
                    if(data['jetfan_no'].length) {
                        if(document.querySelector(`#jetfan_no option`) === null) {
                            for(let i = 0; i < data['jetfan_code'].length; i++) {
                                let opt = document.createElement('option');
                                document.querySelector(`#jetfan_no`).appendChild(opt);
                                opt.innerText = data['jetfan_no'][i];
                                opt.value = data['jetfan_code'][i];
                            }
                        }
                    }
                }
            }

        }
    }

    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 터널선택시 제트팬세팅
const setJetfan = () => {
    document.querySelector('#dept').selectedOptions[0].removeAttribute('selected');
    signalInit(); init('branch'); init('jetfan_no'); init('jetfan_way');

    const data = { 
        'div': 'jetfan_no', 
        'tunn_code': document.querySelector(`#tunnel`).value};
    
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

            } else {

                // 터널명 검색시 해당 터널에 맞는 본부, 지사 가져오기
                const depts =  Object.values(document.querySelectorAll('#dept option'));
                const selectedDept = depts.find((dept) => dept.value === String(data['div_code']));
                selectedDept.selected = true;

                // 해당 본부에 맞는 지사 가져와서 선택하기
                for(let i = 0; i < data['bran_code'].length; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#branch`).appendChild(opt);
                    opt.innerText = data['bran_name'][i];
                    opt.value = data['bran_code'][i];
                }
                const branches = Object.values(document.querySelectorAll('#branch option'));
                const selectedBr = branches.find((br) => br.value === String(data['select_bran_code']));
                selectedBr.selected = true;

                
                const path = window.location.pathname;
                if(path === '/evaluation' || path === '/trace') {
                    if(data['tunn_way1'] && data['tunn_way2']) {
                        if(document.querySelector(`#jetfan_way option`) === null) {
                            let opt1 = document.createElement('option');
                            let opt2 = document.createElement('option');
                            document.querySelector(`#jetfan_way`).appendChild(opt1);
                            document.querySelector(`#jetfan_way`).appendChild(opt2);
                            opt1.innerText = data['tunn_way1'];
                            opt2.innerText = data['tunn_way2'];
                        }
                    }
        
                    if(data['jetfan_no'].length) {
                        if(document.querySelector(`#jetfan_no option`) === null) {
                            for(let i = 0; i < data['jetfan_code'].length; i++) {
                                let opt = document.createElement('option');
                                document.querySelector(`#jetfan_no`).appendChild(opt);
                                opt.innerText = data['jetfan_no'][i];
                                opt.value = data['jetfan_code'][i];
                            }
                        }
                    }
                }
            }
        }
    }
    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 방향 클릭했을때 제트팬 가져오기
const clickWay = () => {
    signalInit(); searchInit(); init('jetfan_no');
    
    const data = { 
        'tunn_code': document.querySelector(`#tunnel`).value, 
        'jetfan_way': document.querySelector(`#jetfan_way`).selectedOptions[0].textContent,
        'div': 'jetfan_way'};

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

            } else {

                if(document.querySelector(`#jetfan_no option`) === null) {
                    for(let i = 0; i < data['jetfan_code'].length; i++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#jetfan_no`).appendChild(opt);
                        opt.innerText = data['jetfan_no'][i];
                        opt.value = data['jetfan_code'][i];
                    }
                }
            }

        }
    }
    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 업데이트 횟수조회 데이터 가져와서 circle 색상 채우기
const changeCircleColor = (eval_update) => {
    
    if(eval_update === 0) {
        document.querySelector('#greenCircle').innerText = '○';
        document.querySelector('#redCircle').innerText = '●';
    } else {
        document.querySelector('#greenCircle').innerText = '●';
        document.querySelector('#redCircle').innerText = '○';
    }

    document.querySelector('#greenCircle').dataset.update = eval_update;
    document.querySelector('#redCircle').dataset.update = eval_update;
}