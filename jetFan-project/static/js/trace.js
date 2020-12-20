const setJetfanData = () => {
    const opt = document.querySelectorAll('#year option');
    if(opt.length > 1) {
        for(let i = opt.length-1; i > 0; i--) {
            opt[i].remove();
        }
    }

    const target = document.querySelector('#jetfan_no');
    const nextTarget = document.querySelector('#year');
    const data = { 'div_code': target.value, 'div': nextTarget.dataset.div };
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);
     
            const jetfan_img = document.querySelectorAll('#jetfan_no option')[target.selectedIndex].dataset.diagram;
            const eval_year = data[0].split(', ');

            // 시설 이력
            document.querySelector('#tunn_name').innerText = data[1];
            document.querySelector('#way').innerText = data[2];
            document.querySelector('#lane').innerText = data[3];
            document.querySelector('#jetfan_lane').innerText = data[3];
            document.querySelector('#jetfan_name').innerText = data[4];
            document.querySelector('#jetfan_maker').innerText = data[5];
            document.querySelector('#eval_emp').innerText = data[6];
            document.querySelector('#user').innerText = data[6];
            document.querySelector('#eval_ymd').innerText = data[7].slice(0, 10);
            document.querySelector('#planImg img').src = './jetfan/2020/' + jetfan_img;
            
            // 운전 점검
            document.querySelector('#eval_vibrate_y_1').innerText = data[8];
            document.querySelector('#eval_vibrate_x_1').innerText = data[9];
            document.querySelector('#eval_vibrate_z_1').innerText = data[10];
            document.querySelector('#eval_vibrate_y_2').innerText = data[11];
            document.querySelector('#eval_vibrate_x_2').innerText = data[12];
            document.querySelector('#eval_vibrate_z_2').innerText = data[13];
            document.querySelector('#eval_amp_r').innerText = data[14];
            document.querySelector('#eval_amp_s').innerText = data[15];
            document.querySelector('#eval_amp_t').innerText = data[16];
            document.querySelector('#eval_volt').innerText = data[17];

            document.querySelector('#eval_update').innerText = data[18];

            for(let j = 0; j < eval_year.length; j++) {
                let opt = document.createElement('option');
                nextTarget.appendChild(opt);
                opt.innerText = eval_year[j];
            }
        }
    }

    xhttp.open("POST", "/trace", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


const setStatusChk = () => {
    const curStatusChk = document.querySelector('#curStatusChk');
    const jetfan_no = document.querySelector('#jetfan_no');
    
    const data = { 'div_code': jetfan_no.value, 'div': curStatusChk.dataset.div };
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);

            // 현 상태 점검 현황
            const tc_seq = data[0].filter((elem, i) => i%2===0);
            const tc_content = data[0].filter((elem, i) => i%2===1);
            const chkTbl = document.querySelector('#curStatusChk table');
            for(let i = 0; i < tc_content.length; i++) {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                let input = document.createElement('input');
                chkTbl.appendChild(tr);
                tr.appendChild(td);
                td.appendChild(input);
                input.type = 'text';
                input.maxLength = 40;
                input.value = tc_content[i];
            }

            
            // 비고 데이터
            const setNoteArr = (arr, opt) => {
                const tn_year = arr.filter((elem, i) => i%3===0);
                const tn_seq = arr.filter((elem, i) => i%3===1);
                const tn_content = arr.filter((elem, i) => i%3===2);

                const etcTbl = document.querySelector('#etc table');
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                etcTbl.appendChild(tr);
                tr.appendChild(td);
                td.className = 'table-title';
                td.innerText = tn_year[0] + '년도';

                for(let i = 0; i < tn_content.length; i++) {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    etcTbl.appendChild(tr);
                    tr.appendChild(td);
                    switch(opt) {
                        case 'noteCurYear':
                            let input = document.createElement('input');
                            td.appendChild(input);
                            input.type = 'text';
                            input.maxLength = 28;
                            input.value = tn_content[i];
                            break;
                        
                        case 'noteOneYearAgo':
                        case 'noteTowYearAgo':
                            td.innerText = tn_content[i];
                            break;
                    }
                }
            }


            setNoteArr(data[1], 'noteCurYear');
            setNoteArr(data[2], 'noteOneYearAgo');
            setNoteArr(data[3], 'noteTowYearAgo');
        }
    }

    xhttp.open('POST', '/trace', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}