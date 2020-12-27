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
            // console.log('data :>> ', data);
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
                    const jetfan_no = data.filter((elem, i) => i%3===0);
                    const jetfan_code = data.filter((elem, i) => i%3===1);
                    const jetfan_way = data.filter((elem, i) => i%3===2).filter((x, i, a) => a.indexOf(x) == i);;

                    // 방향 체크되어있으면 체크해제
                    if(document.querySelector('#wayOption1').checked) {
                        document.querySelector('#wayOption1').checked = false;
                    }
                    if(document.querySelector('#wayOption2').checked) {
                        document.querySelector('#wayOption2').checked = false;
                    }

                    // 방향 데이터 가져오기
                    document.querySelector('#wayOption1 + label').innerText = jetfan_way[0] ?? '방향';
                    document.querySelector('#wayOption2 + label').innerText = jetfan_way[1] ?? '방향';

                    for(let i = 0; i < data.length/3; i++) {
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
    const opt = document.querySelectorAll(`#tunnel option`);
    if(opt.length) {
        for(let i = opt.length-1; i >= 0; i--) {
            opt[i].remove();
        }
    }

    const tunn_search = document.querySelector('#tunn_search').value;
    const data = { 'div_code': tunn_search, 'div': 'tunn_search'};
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            // console.log('data :>> ', data);

            const jetfan_no = data.filter((elem, i) => i%2===0);
            const jetfan_code = data.filter((elem, i) => i%2===1);

            for(let i = 0; i < data.length/2; i++) {
                let opt = document.createElement('option');
                document.querySelector('#tunnel').appendChild(opt);
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