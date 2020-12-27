const setData = () => {

    const jetfan_no = document.querySelector('#jetfan_no').value;
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#eval_update').value;
    const data = { 'jetfan_no': jetfan_no, 'year': year , 'year_no': year_no };

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);

            // 시설 이력
            statusArr = data[0];
            document.querySelector('#tunn_name').innerText = statusArr.tunn_name;
            document.querySelector('#way').innerText = statusArr.jetfan_way;
            document.querySelector('#lane').innerText = statusArr.jetfan_lane;
            document.querySelector('#jetfan_name').innerText = statusArr.jetfan_no;
            document.querySelector('#jetfan_maker').innerText = statusArr.jetfan_maker;
            document.querySelector('#eval_emp').innerText = statusArr.eval_emp;
            document.querySelector('#user').innerText = statusArr.eval_emp;
            document.querySelector('#eval_ymd').innerText = statusArr.eval_ymd.slice(0, 10);
            document.querySelector('#planImg img').src = './jetfan/' + statusArr.eval_year + '/' + statusArr.jetfan_diagram;
            
            // 운전 점검
            document.querySelector('#eval_vibrate_y_1').innerText = statusArr.eval_vibrate_y_1;
            document.querySelector('#eval_vibrate_x_1').innerText = statusArr.eval_vibrate_x_1;
            document.querySelector('#eval_vibrate_z_1').innerText = statusArr.eval_vibrate_z_1;
            document.querySelector('#eval_vibrate_y_2').innerText = statusArr.eval_vibrate_y_2;
            document.querySelector('#eval_vibrate_x_2').innerText = statusArr.eval_vibrate_x_2;
            document.querySelector('#eval_vibrate_z_2').innerText = statusArr.eval_vibrate_z_2;
            document.querySelector('#eval_amp_r').innerText = statusArr.eval_amp_r;
            document.querySelector('#eval_amp_s').innerText = statusArr.eval_amp_s;
            document.querySelector('#eval_amp_t').innerText = statusArr.eval_amp_t;
            document.querySelector('#eval_volt').innerText = statusArr.eval_volt;

            
            // 현 상태 점검 현황
            checkArr = data[1];
            const tc_seq = checkArr.filter((elem, i) => i%2===0);
            const tc_content = checkArr.filter((elem, i) => i%2===1);
            const chkInput = document.querySelectorAll('.checkReport');

            for(let i = 0; i < tc_content.length; i++) {
                chkInput[i].value = tc_content[i];
            }



            // 비고 데이터
            const setNoteArr = (arr, opt) => {
                const tn_seq = arr.filter((elem, i) => i%2===0);
                const tn_content = arr.filter((elem, i) => i%2===1);

                const noteCurYear = document.querySelectorAll('.noteCurYear');
                const noteOneYearAgo = document.querySelectorAll('.noteOneYearAgo');
                const noteTowYearAgo = document.querySelectorAll('.noteTowYearAgo');

                for(let i = 0; i < tn_content.length; i++) {
                    switch(opt) {
                        case 'noteCurYear':
                            noteCurYear[i].value = tn_content[i];
                            break;
                        
                        case 'noteOneYearAgo':
                            noteOneYearAgo[i].innerText = tn_content[i];
                            break;

                        case 'noteTowYearAgo':
                            noteTowYearAgo[i].innerText = tn_content[i];
                            break;
                    }
                }
            }
            
            setNoteArr(data[2], 'noteCurYear');
            setNoteArr(data[3], 'noteOneYearAgo');
            setNoteArr(data[4], 'noteTowYearAgo');
        }
    }

    xhttp.open("POST", "/trace", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
};