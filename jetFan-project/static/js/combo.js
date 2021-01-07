// 콤보박스 세팅
const setComboBox = (target, nextTarget) => {
    const opt = document.querySelectorAll(`#${nextTarget} option`);
    if(opt.length) {
        for(let i = opt.length-1; i >= 0; i--) {
            opt[i].remove();
        }
    }

    const _target = document.querySelector(`#${target}`);
    const _nextTarget = document.querySelector(`#${nextTarget}`);
    const data = { 'div_code': _target.value, 'div': _nextTarget.dataset.div};
    
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);
            switch(nextTarget) {
                case 'branch':
                    const bran_name = data.filter((elem, i) => i%2===0);
                    const bran_code = data.filter((elem, i) => i%2===1);
        
                    for(let i = 0; i < data.length/2; i++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#${nextTarget}`).appendChild(opt);
                        opt.innerText = bran_name[i];
                        opt.value = bran_code[i];
                    }
                    break;
                
                case 'tunnel':
                    const tunn_name = data.filter((elem, i) => i%2===0);
                    const tunn_code = data.filter((elem, i) => i%2===1);

                    for(let i = 0; i < data.length/2; i++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#${nextTarget}`).appendChild(opt);
                        opt.innerText = tunn_name[i];
                        opt.value = tunn_code[i];
                    }

                    break;
                
                case 'jetfan_no':
                    const jetfan_no = data[0].filter((elem, i) =>  i%2===0 );
                    const jetfan_code = data[0].filter((elem, i) =>  i%2===1 );

        
                    // 방향 체크되어있으면 체크해제
                    if(document.querySelector('#wayOption1').checked) {
                        document.querySelector('#wayOption1').checked = false;
                    }
                    if(document.querySelector('#wayOption2').checked) {
                        document.querySelector('#wayOption2').checked = false;
                    }

                    
                    if(document.querySelector('#dept option') === null) {
                        let dept_opt = document.createElement('option');
                        document.querySelector('#dept').appendChild(dept_opt);
                        dept_opt.innerText = data[1][0];
                        dept_opt.value = data[1][1];
                    }

                    if(document.querySelector('#branch option') === null) {
                        let bran_opt = document.createElement('option');
                        document.querySelector('#branch').appendChild(bran_opt);
                        bran_opt.innerText = data[2][0];
                        bran_opt.value = data[2][1];
                    }
                    
                    document.querySelector('#wayOption1 + label').innerText = data[3][0] ?? '방향';
                    document.querySelector('#wayOption2 + label').innerText = data[3][1] ?? '방향';

                    for(let i = 0; i < data[0].length/2; i++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#${nextTarget}`).appendChild(opt);
                        opt.innerText = jetfan_no[i];
                        opt.value = jetfan_code[i];
                    }
                    break;
            }
        }
    }

    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}




// const setBranch = () => {
//     const opt = document.querySelectorAll(`#branch option`);
//     if(opt.length) {
//         for(let i = opt.length-1; i >= 0; i--) {
//             opt[i].remove();
//         }
//     }

//     const _target = document.querySelector(`#dept`);
//     const _nextTarget = document.querySelector(`#branch`);
//     const data = { 'div_code': _target.value, 'div': _nextTarget.dataset.div};
    
//     const xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState === 4 && this.status === 200) {
//             let data = JSON.parse(this.responseText);
//             console.log('data :>> ', data);
//             switch(nextTarget) {
//                 case 'branch':
//                     const bran_name = data.filter((elem, i) => i%2===0);
//                     const bran_code = data.filter((elem, i) => i%2===1);
        
//                     for(let i = 0; i < data.length/2; i++) {
//                         let opt = document.createElement('option');
//                         document.querySelector(`#branch`).appendChild(opt);
//                         opt.innerText = bran_name[i];
//                         opt.value = bran_code[i];
//                     }
//                     break;
//                 }
//             }
//         }
    
//         xhttp.open("POST", "/combo", true);
//         xhttp.setRequestHeader('Content-Type', 'application/json');
//         xhttp.send(JSON.stringify(data));
// }














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

    // 본부 초기화
    const dept_opt = document.querySelectorAll(`#dept option`);
    if(dept_opt.length) {
        for(let i = dept_opt.length-1; i >= 0; i--) {
            dept_opt[i].remove();
        }
    }

    // 지사 초기화
    const branch_opt = document.querySelectorAll(`#branch option`);
    if(branch_opt.length) {
        for(let i = branch_opt.length-1; i >= 0; i--) {
            branch_opt[i].remove();
        }
    }

    // 방향 초기화
    document.querySelector('#wayOption1 + label').innerText = '방향';
    document.querySelector('#wayOption2 + label').innerText = '방향';

    // 터널 초기화
    const tunn_opt = document.querySelectorAll(`#tunnel option`);
    if(tunn_opt.length) {
        for(let i = tunn_opt.length-1; i >= 0; i--) {
            tunn_opt[i].remove();
        }
    }

    // 제트팬 초기화
    const jetfan_opt = document.querySelectorAll(`#jetfan_no option`);
    if(jetfan_opt.length) {
        for(let i = jetfan_opt.length-1; i >= 0; i--) {
            jetfan_opt[i].remove();
        }
    }

    const tunn_search = document.querySelector('#tunn_search').value;
    const data = { 'div_code': tunn_search, 'div': 'tunn_search'};
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);

            const tunnel = data[0];
            const tunn_name = tunnel.filter((elem, i) => i%2===0);
            const tunn_code = tunnel.filter((elem, i) => i%2===1);
            for(let i = 0; i < tunnel.length/2; i++) {
                let opt = document.createElement('option');
                document.querySelector('#tunnel').appendChild(opt);
                opt.innerText = tunn_name[i];
                opt.value = tunn_code[i];
            }
        }
    }

    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 방향 클릭했을때 제트팬 가져오기
const getWayOption = (wayOption) => {
    const opt = document.querySelectorAll(`#jetfan_no option`);
    if(opt.length) {
        for(let i = opt.length-1; i >= 0; i--) {
            opt[i].remove();
        }
    }

    const tunn_code = document.querySelector('#tunnel').value;
    const way = document.querySelector(`#${wayOption} + label`).textContent;
    const data = { 'tunn_code': tunn_code, 
                   'jetfan_way': way, 
                   'div': 'jetfan_way'};
                
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            const jetfan_no = data.filter((elem, i) => i%2===0);
            const jetfan_code = data.filter((elem, i) => i%2===1);

            for(let i = 0; i < data.length/2; i++) {
                let opt = document.createElement('option');
                document.querySelector('#jetfan_no').appendChild(opt);
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
}