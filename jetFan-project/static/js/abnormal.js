window.onload = () => {
    const permission = parseInt(sessionStorage.permission);
    const supervisor = displaySupervisor(permission);
    if(!supervisor) {
        document.querySelector('#addBtn').addEventListener('click', uploadFile);
        document.querySelector('#submitBtn').addEventListener('click', modifyData);
        document.querySelector('#myFile').addEventListener('change', showImg);
        document.querySelector('#errPlusBtn').addEventListener('click', errAddContent);
        document.querySelector('#chkPlusBtn').addEventListener('click', chkAddContent);
    } else {
        document.querySelector('#addBtn').addEventListener('click', disabledInputBtn);
        document.querySelector('#errPlusBtn').addEventListener('click', disabledInputBtn);
        document.querySelector('#chkPlusBtn').addEventListener('click', disabledInputBtn);
    }
}

const resolveDelete = (button) => {
    const permission = parseInt(sessionStorage.permission);
    const supervisor = displaySupervisor(permission);
    if(!supervisor) {
        button.onclick = deleteContent;
    } else {
        button.onclick = disabledInputBtn;
    }
}


const initData = () => {
    document.querySelector('#tunnel_name').innerText = '';
    document.querySelector('#tunn_ymd').innerText = '';
    
    const err_text = document.querySelectorAll('#error textarea');
    const chk_text = document.querySelectorAll('#chk textarea');
    if(err_text.length) {
        for(let i = err_text.length-1; i >= 0; i--) {
            err_text[i].remove();
        }
    }
    if(chk_text.length) {
        for(let i = chk_text.length-1; i >= 0; i--) {
            chk_text[i].remove();
        }
    }
    
    const photo = document.querySelector('#photo').childNodes;
    if(photo.length) {
        for(let i = photo.length-1; i >= 0; i--) {
            photo[i].remove();
        }
    }

    const way_opts = document.querySelectorAll('#way option');
    if(way_opts.length) {
        for(let i = way_opts.length-1; i >= 0; i--) {
            way_opts[i].remove();
        }
    }

    const jetfan_opts = document.querySelectorAll('#jetfan option');
    if(jetfan_opts.length) {
        for(let i = jetfan_opts.length-1; i >= 0; i--) {
            jetfan_opts[i].remove();
        }
    }
}


const getData = () => {
    initData();

    let tunn_code = 0;
    if(document.querySelector('.tab button.active').textContent === '검색') {
        tunn_code = document.querySelector('.non-selected-wrapper a.selected').dataset.value;
    } else {
        tunn_code = document.querySelector('#tunnel').value;
    }
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#update').value;

    const data = {'tunn_code': tunn_code,
                  'year': year,
                  'year_no': year_no,
                  'option': 'getContent'};

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
            }
            

            changeCircleColor(data.update);

            if(data['error'].length > 0 && data['chk'].length > 0) {
                // 터널명, 점검일자
                const tunn_name = document.querySelector('#tunnel').selectedOptions[0].textContent;
                document.querySelector('#tunnel_name').innerText = tunn_name + '터널' ?? '';
                document.querySelector('#tunn_ymd').innerText = data['ymd'] ?? '';

                // 이상소견 내용추가
                for(let i = 0; i < data['error'].length; i++) {
                    let textarea = document.createElement('textarea');
                    document.querySelector('#error').appendChild(textarea);
                    textarea.classList.add('content');
                    textarea.innerText = data['error'][i] ?? '';
                    textarea.setAttribute('oninput', "auto_grow(this)");
                    textarea.style.height = textarea.scrollHeight;
                }
                
                // 현장점검 소견 추가
                for(let i = 0; i < data['chk'].length; i++) {
                    let textarea = document.createElement('textarea');
                    document.querySelector('#chk').appendChild(textarea);
                    textarea.classList.add('content');
                    textarea.innerText = data['chk'][i] ?? '';
                    textarea.setAttribute('oninput', "auto_grow(this)");
                    textarea.style.height = textarea.scrollHeight;
                }


                // 참고사진                
                const photo = document.querySelector('#photo');
                for(let i = 0; i < data['photo']['ap_seq'].length; i++) {
                    let div = document.createElement('div');
                    let input = document.createElement('input');
                    let button = document.createElement('img');
                    let img = document.createElement('img');
                    let hr = document.createElement('hr');
                    photo.appendChild(div);
                    photo.appendChild(input);
                    photo.appendChild(button);
                    photo.appendChild(img);
                    photo.appendChild(hr);
                    div.innerText = '⊙ ' + data['photo']['ap_way'][i] + ' - ' + data['photo']['ap_jetfan_no'][i] ?? '';
                    div.setAttribute('id', 'div'+data['photo']['ap_seq'][i]);
                    input.classList.add('refInput');
                    input.setAttribute('id', 'input'+data['photo']['ap_seq'][i]);
                    button.classList.add('delBtn');
                    button.setAttribute('id', 'btn'+data['photo']['ap_seq'][i]);
                    button.dataset.seq = data['photo']['ap_seq'][i];
                    resolveDelete(button);
                    img.classList.add('refImg');
                    img.setAttribute('id', 'img'+data['photo']['ap_seq'][i]);
                    input.value = data['photo']['ap_comment'][i];
                    button.src = './img/minus.png';
                    img.setAttribute('src', './data/abnormal/' + year + '/' + year_no + '/' + data['photo']['ap_photo'][i]);
                    img.setAttribute('alt', data['photo']['ap_photo'][i]);
                    hr.setAttribute('id', 'hr'+data['photo']['ap_seq'][i]);
                }

            } else {
                const tunn_name = document.querySelector('#tunnel').selectedOptions[0].textContent;
                document.querySelector('#tunnel_name').innerText = tunn_name + '터널' ?? '';
                document.querySelector('#tunn_ymd').innerText = data['ymd'] ?? '';

                let err_textarea = document.createElement('textarea');
                document.querySelector('#error').appendChild(err_textarea);
                err_textarea.classList.add('content');
                err_textarea.setAttribute('oninput', "auto_grow(this)");
                err_textarea.style.height = err_textarea.scrollHeight;
                
                let chk_textarea = document.createElement('textarea');
                document.querySelector('#chk').appendChild(chk_textarea);
                chk_textarea.classList.add('content');
                chk_textarea.setAttribute('oninput', "auto_grow(this)");
                chk_textarea.style.height = chk_textarea.scrollHeight;

                const photo = document.querySelector('#photo');
                let div = document.createElement('div');
                let input = document.createElement('input');
                let button = document.createElement('img');
                let img = document.createElement('img');
                let hr = document.createElement('hr');
                photo.appendChild(div);
                photo.appendChild(input);
                photo.appendChild(button);
                photo.appendChild(img);
                photo.appendChild(hr);
                input.classList.add('refInput');
                button.src = './img/minus.png';
                button.classList.add('delBtn');
                button.dataset.seq = 0;
                // button.onclick = deleteContent;
                resolveDelete(button);
                img.classList.add('refImg');
                img.src = 'http://via.placeholder.com/300x100';
                input.setAttribute('id', 'input0');
                button.setAttribute('id', 'btn0');
                img.setAttribute('id', 'img0');
                hr.setAttribute('id', 'hr0');

            }

            // 추가버튼 왼쪽 콤보박스 - 방향
            const comment = document.querySelector('#comment');
            let opt1 = document.createElement('option');
            let opt2 = document.createElement('option');
            comment.querySelector('#way').appendChild(opt1);
            comment.querySelector('#way').appendChild(opt2);
            opt1.innerText = data['way1'];
            opt2.innerText = data['way2'];
            
            
            // 추가버튼 왼쪽 콤보박스 - 제트팬
            for(let i = 0; i < data['jetfan'].length+1; i++) {
                let opt = document.createElement('option');
                comment.querySelector('#jetfan').appendChild(opt);
                opt.innerText = (i === 0) ? '공통' : data['jetfan'][i-1];
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

    xhttp.open("POST", "/abnormal", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
};



// 방향콤보박스 클릭
const getJetfan = () => {
    // 제트팬 초기화
    const opts = document.querySelectorAll('#jetfan option');
    if(opts.length) {
        for(let i = opts.length-1; i >= 0; i--) {
            opts[i].remove();
        }
    }

    const tunn_code = document.querySelector('#tunnel').value;
    const way = document.querySelector('#way').selectedOptions[0].textContent;
    const data = {'tunn_code': tunn_code,
                  'way': way,
                  'option': 'getJetfan'};

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
            }
            
            const comment = document.querySelector('#comment');
            for(let i = 0; i < data.jetfan.length+1; i++) {
                let opt = document.createElement('option');
                comment.querySelector('#jetfan').appendChild(opt);
                opt.innerText = (i === 0) ? '공통' : data.jetfan[i-1];
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

    xhttp.open("POST", "/abnormal", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 이미지 미리보기
const showImg = () => {
    const fileElem = document.querySelector('#myFile'),
        comment = document.querySelector('#comment'),
        previewImg = document.querySelector("#previewImg");

    if (!fileElem.files.length) {
        previewImg.src = 'http://via.placeholder.com/300x100';
    } else {
        previewImg.src = URL.createObjectURL(fileElem.files[0]);
        previewImg.style.height = 200;
        previewImg.onload = function() {
            URL.revokeObjectURL(fileElem.src);
        }
        comment.appendChild(previewImg);
    }
}


// 사진파일 업로드
const uploadFile = function() {
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#update').value;
    const tunn_code = document.querySelector('#tunnel').value;
    const delBtn = document.querySelectorAll('.delBtn');
    const seq = Number(delBtn[delBtn.length-1].dataset.seq)+1 ?? 1;
    const fileElem = document.querySelector('#myFile');

    const fd = new FormData(); 
    fd.append('file', fileElem.files[0]);
    fd.append('year', year);
    fd.append('year_no', year_no);
    fd.append('tunn_code', tunn_code);
    fd.append('seq', seq);

    if (!fileElem.value) {
        Swal.fire({
            title: '사전점검', 
            text: '파일을 먼저 선택해주세요.',
            icon: 'info',
            confirmButtonText: '확인'
        });
        return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            let result = this.responseText;
            if(result === 'succ') {
                addContent(`a_${tunn_code}_${seq}.jpg`);

            } else {
                Swal.fire({
                    title: '사진추가실패', 
                    text: '사진 추가에 실패하였습니다.',
                    icon: 'warning',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
            }

        } else {
            Swal.fire({
                title: '응답실패', 
                text: '해당 데이터가 없습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });
        }
    };

    xhr.open('POST', '/abupload');
    xhr.send(fd);
};


// 사진추가
const addContent = (filename) => {

    const opts = document.querySelector('#comment option');
    if(opts === null) {
        Swal.fire({
            title: '사전점검', 
            text: '데이터조회버튼을 먼저 눌러주세요.',
            icon: 'info',
            confirmButtonText: '확인',
            onAfterClose: () => window.scrollTo(0,0)
        });
        
    } else {
        const tunn_code = document.querySelector('#tunnel').value;
        const year = document.querySelector('#year').value;
        const year_no = document.querySelector('#update').value;
        const ap_way = document.querySelector('#way').selectedOptions[0].textContent;
        const ap_jetfan_no = document.querySelector('#jetfan').selectedOptions[0].textContent;
        const ap_comment = document.querySelector('#commentText').value ?? '';
        const ap_photo = filename ?? 'sample.jpg';

        const content = [{
            'ap_way': ap_way,
            'ap_jetfan_no': ap_jetfan_no,
            'ap_comment': ap_comment,
            'ap_photo': ap_photo
        }];
        
        const data = {
            'tunn_code': tunn_code,
            'year': year,
            'year_no': year_no,
            'data': content,
            'option': 'addContent'
            };


        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.responseText);
                console.log('data22222 :>> ', data);

                if(data.hasOwnProperty('err_msg')) {
                    Swal.fire({
                        title: '사진추가실패', 
                        text: data.err_msg,
                        icon: 'warning',
                        confirmButtonText: '확인',
                        onAfterClose: () => window.scrollTo(0,0)
                    });
                    return false;
                }

                Swal.fire({
                    title: '성공', 
                    text: '사진이 정상적으로 추가되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });

                // 비어있는 참고사진 객체 삭제
                if(document.querySelector('#input0')) {
                    document.querySelector('#input0').remove();
                    document.querySelector('#btn0').remove();
                    document.querySelector('#img0').remove();
                    document.querySelector('#hr0').remove();
                }

                // 참고사진에 추가
                const photo = document.querySelector('#photo');
                let seq = 1;
                if(document.querySelectorAll('.delBtn').length) {
                    const delBtn = document.querySelectorAll('.delBtn');
                    seq = Number(delBtn[delBtn.length-1].dataset.seq)+1;
                }

                const div = document.createElement('div');
                const input = document.createElement('input');
                const button = document.createElement('img');
                const img = document.createElement('img');
                const hr = document.createElement('hr');
                const img_path = './data/abnormal/' + year + '/' + year_no + '/';
                const file_name = 'a_' + tunn_code + '_' + seq + '.jpg';
                
                photo.appendChild(div);
                photo.appendChild(input);
                photo.appendChild(button);
                photo.appendChild(img);
                photo.appendChild(hr);
                div.innerText = '⊙ ' + ap_way + ' - ' + ap_jetfan_no ?? '';
                input.value = ap_comment;
                input.classList.add('refInput');
                button.classList.add('delBtn');
                button.dataset.seq = seq;
                // button.onclick = deleteContent;
                resolveDelete(button);
                button.src = './img/minus.png';
                img.classList.add('refImg');
                img.setAttribute('src', img_path + file_name);
                img.setAttribute('alt', file_name);

                div.setAttribute('id', 'div'+seq);
                input.setAttribute('id', 'input'+seq);
                button.setAttribute('id', 'btn'+seq);
                img.setAttribute('id', 'img'+seq);
                hr.setAttribute('id', 'hr'+seq);
                

                // 추가부분 초기화
                document.querySelector('#myFile').value = '';
                document.querySelector('#commentText').value = '';
                document.querySelector('#previewImg').src = 'http://via.placeholder.com/300x100';

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

        xhttp.open("POST", "/abnormal", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));

    }
}

// 사진삭제
const deleteContent = (e) => {
    if (confirm('정말로 삭제하시겠습니까?')) {

        const tunn_code = document.querySelector('#tunnel').value;
        const year = document.querySelector('#year').value;
        const year_no = document.querySelector('#update').value;
        const seq = e.target.dataset.seq;
    
        const data = {
            'tunn_code': tunn_code,
            'year': year,
            'year_no': year_no,
            'seq': seq};
    
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.responseText);
                console.log('data :>> ', data);

                if(data.hasOwnProperty('err_msg')) {
                    Swal.fire({
                        title: '사진삭제실패', 
                        text: data.err_msg,
                        icon: 'warning',
                        confirmButtonText: '확인'
                    });
                    return false;
                }

                Swal.fire({
                    title: '사진삭제성공', 
                    text: '사진이 정상적으로 삭제되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });

                document.querySelector(`#div${seq}`).remove();
                document.querySelector(`#input${seq}`).remove();
                document.querySelector(`#btn${seq}`).remove();
                document.querySelector(`#img${seq}`).remove();
                document.querySelector(`#hr${seq}`).remove();

                if(seq === '1') {
                    const photo = document.querySelector('#photo');
                    let input = document.createElement('input');
                    let button = document.createElement('img');
                    let img = document.createElement('img');
                    let hr = document.createElement('hr');
                    
                    photo.appendChild(input);
                    photo.appendChild(button);
                    photo.appendChild(img);
                    photo.appendChild(hr);
                    input.classList.add('refInput');
                    button.classList.add('delBtn');
                    button.dataset.seq = 0;
                    button.onclick = deleteContent;
                    button.src = './img/minus.png';
                    img.classList.add('refImg');
                    img.src = 'http://via.placeholder.com/300x100';

                    input.setAttribute('id', 'input0');
                    button.setAttribute('id', 'btn0');
                    img.setAttribute('id', 'img0');
                    hr.setAttribute('id', 'hr0');
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
    
        xhttp.open("DELETE", "/abnormal", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));

    } else {
        console.log('삭제취소');
    }
}


// 전체 데이터 반영
const modifyData = () => {

    if(document.querySelector('#tunnel_name').textContent === '') {
        Swal.fire({
            title: '사전점검', 
            text: '데이터 조회 후 입력가능합니다.',
            icon: 'info',
            confirmButtonText: '확인',
            onAfterClose: () => window.scrollTo(0,0)
        });
        return false;   
    }

    
    if(document.querySelector('#tunn_ymd').textContent === '') {
        Swal.fire({
            title: '사전점검', 
            text: '평가표관리에서 점검일자를 입력해주세요.',
            icon: 'info',
            confirmButtonText: '확인',
            onAfterClose: () => window.scrollTo(0,0)
        });
        return false;   
    }

    const tunn_code = document.querySelector('#tunnel').value;
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#update').value;

    const contents = [];
    const errorContents = document.querySelectorAll('#error textarea');
    const chkContents = document.querySelectorAll('#chk textarea');

    errorContents.forEach((content, i) => {
        contents.push({
            'ar_tunn_code': tunn_code,
            'ar_year': year,
            'ar_year_no': year_no,
            'ar_type': 1,
            'ar_seq': i+1,
            'ar_content': content.value});
    });

    chkContents.forEach((content, i) => {
        contents.push({
            'ar_tunn_code': tunn_code,
            'ar_year': year,
            'ar_year_no': year_no,
            'ar_type': 2,
            'ar_seq': i+1,
            'ar_content': content.value});
    });

    console.log('contents :>> ', contents);

    const data = {
        'tunn_code': tunn_code,
        'year': year,
        'year_no': year_no,
        'data': contents};

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);

            if(data.hasOwnProperty('err_msg')) {
                Swal.fire({
                    title: '데이터입력실패', 
                    text: data.err_msg,
                    icon: 'warning',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
                return false;
            }

            changeCircleColor(1);

            Swal.fire({
                title: '입력성공', 
                text: '데이터가 정상적으로 입력되었습니다.',
                icon: 'success',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });

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

    xhttp.open("PUT", "/abnormal", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 플러스버튼 클릭 이벤트 함수
const errAddContent = () => {
    let textarea = document.createElement('textarea');
    document.querySelector('#error').appendChild(textarea);
    textarea.classList.add('content');
    textarea.setAttribute('oninput', "auto_grow(this)");
    textarea.style.height = textarea.scrollHeight;
}

const chkAddContent = () => {
    let textarea = document.createElement('textarea');
    document.querySelector('#chk').appendChild(textarea);
    textarea.classList.add('content');
    textarea.setAttribute('oninput', "auto_grow(this)");
    textarea.style.height = textarea.scrollHeight;
}