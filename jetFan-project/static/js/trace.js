window.onload = () => {
    document.querySelector('#inputBtn').addEventListener('click', inputData);
    document.querySelector('#year').addEventListener('change', changeYear);
};

// 콤보박스 연도 변경시 이벤트
const changeYear = () => {
    let curYear = document.querySelector('#year').value;
    document.querySelector('#curYear').innerText = curYear + '년도';
    document.querySelector('#oneYearAgo').innerText = curYear-1 + '년도';
    document.querySelector('#towYearAgo').innerText = curYear-2 + '년도';
}

// 현상태점검현황, 비고데이터 초기화
const initData = () => {
    const tc_contents = document.querySelectorAll('#curStatusChk textarea');
    for(content of tc_contents) {
        content.value = '';
    }

    const tn_contents = document.querySelectorAll('#etc textarea');
    for(content of tn_contents) {
        content.value = '';
    }

    const noteOneYearAgo = document.querySelectorAll('.noteOneYearAgo');
    for(content of noteOneYearAgo) {
        content.innerText = '';
    }

    const noteTowYearAgo = document.querySelectorAll('.noteTowYearAgo');
    for(content of noteTowYearAgo) {
        content.innerText = '';
    }
}


// 콤보박스 아래 데이터 조회 버튼클릭 함수
const getData = () => {
    const jetfan_no = document.querySelector('#jetfan_no').value;
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#update').value;
    const data = { 'jetfan_no': jetfan_no, 'year': year , 'year_no': year_no };

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data22222 :>> ', data);

            changeCircleColor(data.update);
            initData();

            // 시설 이력
            document.querySelector('#tunn_name').innerText = data.eval.tunn_name ?? '';
            document.querySelector('#way').innerText = data.eval.jetfan_way ?? '';
            document.querySelector('#lane').innerText = data.eval.jetfan_lane ?? '';
            document.querySelector('#jetfan_name').innerText = data.eval.jetfan_no ?? '';
            document.querySelector('#jetfan_maker').innerText = data.eval.jetfan_maker ?? '';
            document.querySelector('#eval_emp').innerText = data.eval.eval_emp ?? '';
            document.querySelector('#user').innerText = data.eval.eval_emp ?? '';
            document.querySelector('#eval_ymd').innerText = data.eval.eval_ymd ? data.eval.eval_ymd.slice(0, 10) : '';
            document.querySelector('#planImg img').src = data.eval.jetfan_diagram ? 
                                                        './data/jetfan/' + data.eval.eval_year + '/' + data.eval.jetfan_diagram : 
                                                        'http://via.placeholder.com/100x100';
            
            // 운전 점검
            document.querySelector('#eval_vibrate_y_1').innerText = data.eval.eval_vibrate_y_1 ?? '';
            document.querySelector('#eval_vibrate_x_1').innerText = data.eval.eval_vibrate_x_1 ?? '';
            document.querySelector('#eval_vibrate_z_1').innerText = data.eval.eval_vibrate_z_1 ?? '';
            document.querySelector('#eval_vibrate_y_2').innerText = data.eval.eval_vibrate_y_2 ?? '';
            document.querySelector('#eval_vibrate_x_2').innerText = data.eval.eval_vibrate_x_2 ?? '';
            document.querySelector('#eval_vibrate_z_2').innerText = data.eval.eval_vibrate_z_2 ?? '';
            document.querySelector('#eval_amp_r').innerText = data.eval.eval_amp_r ?? '';
            document.querySelector('#eval_amp_s').innerText = data.eval.eval_amp_s ?? '';
            document.querySelector('#eval_amp_t').innerText = data.eval.eval_amp_t ?? '';
            document.querySelector('#eval_volt').innerText = data.eval.eval_volt ?? '';

            if(data.eval === {}) {
                Swal.fire({
                    title: '데이터 없음!', 
                    text: '평가표 데이터가 존재하지 않습니다.',
                    icon: 'info',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
                return false;
            }

            
            // 현 상태 점검 현황
            if(data.tc_content.length) {
                const chkInput = document.querySelectorAll('.checkReport');
                for(let i = 0; i < data.tc_content.length; i++) {
                    chkInput[i].value = data.tc_content[i];
                }
            } else {
                Swal.fire({
                    title: '데이터 없음!', 
                    text: '현 상태 점검 현황 데이터가 존재하지 않습니다.',
                    icon: 'info',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
            }


            // 비고 데이터
            const setNoteArr = (arr, opt) => {
                console.log('arr :>> ', arr);
                if(arr.length) {
                    const noteCurYear = document.querySelectorAll('.noteCurYear');
                    const noteOneYearAgo = document.querySelectorAll('.noteOneYearAgo');
                    const noteTowYearAgo = document.querySelectorAll('.noteTowYearAgo');
    
                    for(let i = 0; i < arr.length; i++) {
                        switch(opt) {
                            case 'noteCurYear':
                                noteCurYear[i].value = arr[i];
                                break;
                            
                            case 'noteOneYearAgo':
                                noteOneYearAgo[i].innerText = arr[i];
                                break;
    
                            case 'noteTowYearAgo':
                                noteTowYearAgo[i].innerText = arr[i];
                                break;
                        }
                    }
                } else {
                    Swal.fire({
                        title: '데이터 없음!', 
                        text: '비고 데이터가 존재하지 않습니다.',
                        icon: 'info',
                        confirmButtonText: '확인',
                        onAfterClose: () => window.scrollTo(0,0)
                    });
                }
            }
            
            setNoteArr(data.noteCurYear, 'noteCurYear');
            setNoteArr(data.noteOneYearAgo, 'noteOneYearAgo');
            setNoteArr(data.noteTowYearAgo, 'noteTowYearAgo');
        }
    }

    xhttp.open("POST", "/trace", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
};


// 현상태 점검현황 및 비고 데이터 입력/수정
const inputData = () => {
    const jetfan_no = document.querySelector('#jetfan_no').value;
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#update').value;
    const checkReports = document.querySelectorAll('.checkReport');
    const noteCurYears = document.querySelectorAll('.noteCurYear');
    
    let tc_contents = Array();
    let tn_contents = Array();
    checkReports.forEach((checkReport, i) => {
        if(checkReport.value) {
            tc_contents.push({ 'tc_seq': String(i+1), 'tc_content': checkReport.value });
        } else {
            tc_contents.push({'tc_seq': String(i+1), 'tc_content': ""});
        }
    });

    noteCurYears.forEach((noteCurYear, i) => {
        if(noteCurYear.value) {
            tn_contents.push({ 'tn_seq': String(i+1), 'tn_content': noteCurYear.value });
        } else {
            tn_contents.push({'tn_seq': String(i+1), 'tn_content': ""});
        }
    });

    const data = {
        'jetfan_no': jetfan_no, 
        'year': year , 
        'year_no': year_no,
        'tc_content': tc_contents,
        'tn_content': tn_contents
    };
    console.log('data :>> ', data);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);
            const chk_status = data[0].status.status_code;
            const note_status = data[1].status.status_code;


            if(chk_status === 200 && note_status === 200) {

                changeCircleColor(1);

                Swal.fire({
                    title: '입력성공', 
                    text: '정상적으로 입력되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });

            } else {
                Swal.fire({
                    title: '입력실패', 
                    text: '입력에 실패하였습니다.',
                    icon: 'warning',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });

            }

        } else if(this.status === 500) {
            Swal.fire({
                title: '응답실패', 
                text: '서버응답에 실패하였습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
            return false;
        }
    }

    xhttp.open("PUT", "/trace", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}