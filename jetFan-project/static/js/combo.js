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
            
            
            // 본부
            const division = data[0];
            const tunn_div_code = data[5][0];
            const div_name = division.filter((elem, i) => i%2===0);
            const div_code = division.filter((elem, i) => i%2===1);
            const dept = document.querySelector('#dept');
            for(let i = 0; i < division.length/2; i++) {
                let opt = document.createElement('option');
                dept.appendChild(opt);
                opt.innerText = div_name[i];
                opt.value = div_code[i];
                if(div_code[i] === tunn_div_code) {
                    opt.selected = true;
                }
            }


            // 지사
            const branch = data[1];
            const tunn_bran_code = data[5][1];
            const bran_code = branch.filter((elem, i) => i%2===1);
            const bran_name = branch.filter((elem, i) => i%2===0);
            const bran = document.querySelector('#branch');
            for(let i = 0; i < branch.length/2; i++) {
                let opt = document.createElement('option');
                bran.appendChild(opt);
                opt.innerText = bran_name[i];
                opt.value = bran_code[i];
                if(bran_code[i] === tunn_bran_code) {
                    opt.selected = true;
                }
            }



            // 터널
            const tunnel = data[2];
            const tunn_name = tunnel.filter((elem, i) => i%2===0);
            const tunn_code = tunnel.filter((elem, i) => i%2===1);
            for(let i = 0; i < tunnel.length/2; i++) {
                let opt = document.createElement('option');
                document.querySelector('#tunnel').appendChild(opt);
                opt.innerText = tunn_name[i];
                opt.value = tunn_code[i];
            }

            const path = window.location.pathname;
            if(path === '/evaluation' || path === '/trace') {
                // 방향
                const way = data[3];
                for(let i = 0; i < way.length; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#jetfan_way`).appendChild(opt);
                    opt.innerText = way[i];
                }
    
    
                // 제트팬
                const jetfan = data[4];
                const jetfan_name = jetfan.filter((elem, i) => i%2===0);
                const jetfan_code = jetfan.filter((elem, i) => i%2===1);
                for(let i = 0; i < jetfan.length/2; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#jetfan_no`).appendChild(opt);
                    opt.innerText = jetfan_name[i];
                    opt.value = jetfan_code[i];
                }
            }

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

            const bran_name = data[0].filter((elem, i) => i%2===0);
            const bran_code = data[0].filter((elem, i) => i%2===1);
            for(let i = 0; i < data[0].length/2; i++) {
                let opt = document.createElement('option');
                document.querySelector(`#branch`).appendChild(opt);
                opt.innerText = bran_name[i];
                opt.value = bran_code[i];
            }
            
            const tunn_name = data[1].filter((elem, i) => i%2===0);
            const tunn_code = data[1].filter((elem, i) => i%2===1);
            if(document.querySelector(`#tunnel option`) === null) {
                for(let i = 0; i < data[1].length/2; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#tunnel`).appendChild(opt);
                    opt.innerText = tunn_name[i];
                    opt.value = tunn_code[i];
                }
            }
            
            const path = window.location.pathname;
            if(path === '/evaluation' || path === '/trace') {
                if(data.length > 2) {
                    if(document.querySelector(`#jetfan_way option`) === null) {
                        for(let i = 0; i < data[2].length; i++) {
                            let opt = document.createElement('option');
                            document.querySelector(`#jetfan_way`).appendChild(opt);
                            opt.innerText = data[2][i];
                        }
                    }
                }
    
                if(data.length > 3) {
                    const jetfan_name = data[3].filter((elem, i) => i%2===0);
                    const jetfan_code = data[3].filter((elem, i) => i%2===1);
                    if(document.querySelector(`#jetfan_no option`) === null) {
                        for(let i = 0; i < data[3].length/2; i++) {
                            let opt = document.createElement('option');
                            document.querySelector(`#jetfan_no`).appendChild(opt);
                            opt.innerText = jetfan_name[i];
                            opt.value = jetfan_code[i];
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
    console.log('data :>> ', data);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);

            const tunn_name = data[0].filter((elem, i) => i%2===0);
            const tunn_code = data[0].filter((elem, i) => i%2===1);
            for(let i = 0; i < data[0].length/2; i++) {
                let opt = document.createElement('option');
                document.querySelector(`#tunnel`).appendChild(opt);
                opt.innerText = tunn_name[i];
                opt.value = tunn_code[i];
            }

            const path = window.location.pathname;
            if(path === '/evaluation' || path === '/trace') {
                for(let i = 0; i < data[1].length; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#jetfan_way`).appendChild(opt);
                    opt.innerText = data[1][i];
                }

                const jetfan_name = data[2].filter((elem, i) => i%2===0);
                const jetfan_code = data[2].filter((elem, i) => i%2===1);
                for(let i = 0; i < data[2].length/2; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#jetfan_no`).appendChild(opt);
                    opt.innerText = jetfan_name[i];
                    opt.value = jetfan_code[i];
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
    signalInit(); searchInit(); init('branch'); init('jetfan_no'); init('jetfan_way');

    const data = { 'div': 'jetfan_no',
                   'tunn_code': document.querySelector(`#tunnel`).value
                 };
    
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);

            // 터널명 검색시 해당 터널에 맞는 본부, 지사 가져오기
            const depts =  Object.values(document.querySelectorAll('#dept option'));
            const selectedDept = depts.find((dept) => dept.value === String(data[1]));
            selectedDept.selected = true;

            // 해당 본부에 맞는 지사 가져와서 선택하기
            const bran_name = data[2].filter((elem, i) =>  i%2===0 );
            const bran_code = data[2].filter((elem, i) =>  i%2===1 );
            for(let i = 0; i < data[2].length/2; i++) {
                let opt = document.createElement('option');
                document.querySelector(`#branch`).appendChild(opt);
                opt.innerText = bran_name[i];
                opt.value = bran_code[i];
            }
            const branches = Object.values(document.querySelectorAll('#branch option'));
            const selectedBr = branches.find((br) => br.value === String(data[3]));
            selectedBr.selected = true;

            
            const path = window.location.pathname;
            if(path === '/evaluation' || path === '/trace') {
                // 방향
                for(let i = 0; i < data[4].length; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#jetfan_way`).appendChild(opt);
                    opt.innerText = data[4][i];
                }

                // 제트팬
                const jetfan_no = data[0].filter((elem, i) =>  i%2===0 );
                const jetfan_code = data[0].filter((elem, i) =>  i%2===1 );
                for(let i = 0; i < data[0].length/2; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#jetfan_no`).appendChild(opt);
                    opt.innerText = jetfan_no[i];
                    opt.value = jetfan_code[i];
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
    
    const data = { 'tunn_code': document.querySelector(`#tunnel`).value, 
                   'jetfan_way': document.querySelector(`#jetfan_way`).selectedOptions[0].textContent,
                   'div': 'jetfan_way'};

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);

            const jetfan_no = data.filter((elem, i) =>  i%2===0 );
            const jetfan_code = data.filter((elem, i) =>  i%2===1 );
            for(let i = 0; i < data.length/2; i++) {
                let opt = document.createElement('option');
                document.querySelector(`#jetfan_no`).appendChild(opt);
                opt.innerText = jetfan_no[i];
                opt.value = jetfan_code[i];
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