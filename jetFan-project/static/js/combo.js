// 초기화
const init = (target) => {
    const opt = document.querySelectorAll(`#${target} option`);
    if(opt.length) {
        for(let i = opt.length-1; i >= 0; i--) {
            opt[i].remove();
        }
    }
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

    init('dept'); init('branch'); init('tunnel'); init('jetfan_no'); init('jetfan_way');

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


// 본부선택시 지사세팅
const setBranch = () => {
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
            
            if(document.querySelector(`#jetfan_way option`) === null) {
                for(let i = 0; i < data[2].length; i++) {
                    let opt = document.createElement('option');
                    document.querySelector(`#jetfan_way`).appendChild(opt);
                    opt.innerText = data[2][i];
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
    init('tunnel'); init('jetfan_way'); init('jetfan_no');

    const data = { 'div_code': document.querySelector(`#branch`).value, 'div': 'tunnel'};
    
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);

            const tunn_name = data[0].filter((elem, i) => i%2===0);
            const tunn_code = data[0].filter((elem, i) => i%2===1);
            for(let i = 0; i < data[0].length/2; i++) {
                let opt = document.createElement('option');
                document.querySelector(`#tunnel`).appendChild(opt);
                opt.innerText = tunn_name[i];
                opt.value = tunn_code[i];
            }

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

    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 터널선택시 제트팬세팅
const setJetfan = () => {
    init('jetfan_no'); init('jetfan_way');

    const data = { 'div_code': document.querySelector(`#tunnel`).value, 'div': 'jetfan_no'};
    
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);

            // 터널명 검색시 해당 터널에 맞는 본부, 지사 가져오기
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
            
            // 방향
            for(let i = 0; i < data[3].length; i++) {
                let opt = document.createElement('option');
                document.querySelector(`#jetfan_way`).appendChild(opt);
                opt.innerText = data[3][i];
                // if(i === 0) opt.selected = true;
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
    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 방향 클릭했을때 제트팬 가져오기
const clickWay = () => {
    init('jetfan_no');
    
    test
    // const tunn_code = document.querySelector('#tunnel').value;
    // const way = document.querySelector(`#${wayOption} + label`).textContent;
    // const data = { 'tunn_code': tunn_code, 
    //                'jetfan_way': way, 
    //                'div': 'jetfan_way'};
                
    // const xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState === 4 && this.status === 200) {
    //         let data = JSON.parse(this.responseText);
    //         const jetfan_no = data.filter((elem, i) => i%2===0);
    //         const jetfan_code = data.filter((elem, i) => i%2===1);

    //         for(let i = 0; i < data.length/2; i++) {
    //             let opt = document.createElement('option');
    //             document.querySelector('#jetfan_no').appendChild(opt);
    //             opt.innerText = jetfan_no[i];
    //             opt.value = jetfan_code[i];
    //         }
    //     }
    // }
    // xhttp.open("POST", "/combo", true);
    // xhttp.setRequestHeader('Content-Type', 'application/json');
    // xhttp.send(JSON.stringify(data));
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