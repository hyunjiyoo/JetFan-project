
const tabCombo = (evt, comboOpt) => {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(comboOpt).style.display = "block";
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

const signalInit = () => {
    document.querySelector('#greenCircle').innerText = '○';
    document.querySelector('#redCircle').innerText = '○';
}


// 본부선택시 지사세팅
const setBranch = () => {
    signalInit();
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
    signalInit(); init('tunnel'); init('jetfan_way'); init('jetfan_no');

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
const clickWay = (wayId, jetfanId) => {
    signalInit(); init(`${jetfanId}`);
    
    const data = { 
        'jetfan_way': document.querySelector(`#${wayId}`).selectedOptions[0].textContent,
        'div': 'jetfan_way'};
        
        if(wayId === 'jetfan_way') {
            data['tunn_code'] = document.querySelector(`#tunnel`).value;
        } else {
            data['tunn_code'] = document.querySelector('.non-selected-wrapper a.selected').dataset.value;
        }

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

                if(document.querySelector(`#${jetfanId} option`) === null) {
                    for(let i = 0; i < data['jetfan_code'].length; i++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#${jetfanId}`).appendChild(opt);
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
const changeCircleColor = (update) => {
    
    if(update === 0) {
        document.querySelector('#greenCircle').innerText = '○';
        document.querySelector('#redCircle').innerText = '●';
    } else {
        document.querySelector('#greenCircle').innerText = '●';
        document.querySelector('#redCircle').innerText = '○';
    }

    document.querySelector('#greenCircle').dataset.update = update;
    document.querySelector('#redCircle').dataset.update = update;
}