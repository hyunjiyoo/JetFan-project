window.onload = () => {
    document.querySelector('#addBtn').addEventListener('click', addContent);
    document.querySelector('#submitBtn').addEventListener('click', modifyData);
}


const initData = () => {
    document.querySelector('#tunnel_name').innerText = '';
    
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

    const tunn_name = document.querySelector('#tunnel').selectedOptions[0].textContent;
    document.querySelector('#tunnel_name').innerText = tunn_name + '터널' ?? '';
    
    const tunn_code = document.querySelector('#tunnel').value;
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

            if(data[0].length > 0 && data[1].length > 0 && data[2].length > 0) {
                // 이상소견 내용추가
                for(let i = 0; i < data[0].length; i++) {
                    let textarea = document.createElement('textarea');
                    document.querySelector('#error').appendChild(textarea);
                    textarea.classList.add('content');
                    textarea.innerText = data[0][i] ?? '';
                }
                
                // 현장점검 소견 추가
                for(let i = 0; i < data[1].length; i++) {
                    let textarea = document.createElement('textarea');
                    document.querySelector('#chk').appendChild(textarea);
                    textarea.classList.add('content');
                    textarea.innerText = data[1][i] ?? '';
                }


                // 참고사진
                const ap_seq = data[2].filter((elem, i) => i%5===0);
                const ap_way = data[2].filter((elem, i) => i%5===1);
                const ap_jetfan_no = data[2].filter((elem, i) => i%5===2);
                const ap_comment = data[2].filter((elem, i) => i%5===3);
                const ap_photo = data[2].filter((elem, i) => i%5===4);
                
                const photo = document.querySelector('#photo');
                for(let i = 0; i < data[2].length/5; i++) {
                    let div = document.createElement('div');
                    let input = document.createElement('input');
                    let button = document.createElement('button');
                    let img = document.createElement('img');
                    let hr = document.createElement('hr');
                    photo.appendChild(div);
                    photo.appendChild(input);
                    photo.appendChild(button);
                    photo.appendChild(img);
                    photo.appendChild(hr);
                    div.innerText = '⊙ ' + ap_way[i] + ' - ' + ap_jetfan_no[i] ?? '';
                    div.setAttribute('id', 'div'+ap_seq[i]);
                    input.classList.add('refInput');
                    input.setAttribute('id', 'input'+ap_seq[i]);
                    button.classList.add('delBtn');
                    button.setAttribute('id', 'btn'+ap_seq[i]);
                    button.dataset.seq = ap_seq[i];
                    button.onclick = deleteContent;
                    img.classList.add('refImg');
                    img.setAttribute('id', 'img'+ap_seq[i]);
                    input.value = ap_comment[i];
                    button.innerText = '삭제';
                    img.setAttribute('src', './data/abnormal/' + year + '/' + year_no + '/' + ap_photo[i]);
                    img.setAttribute('alt', ap_photo[i]);
                }


                // 추가버튼 왼쪽 콤보박스 - 방향
                const comment = document.querySelector('#comment');
                for(let i =0; i < data[3].length; i++) {
                    let opt = document.createElement('option');
                    comment.querySelector('#way').appendChild(opt);
                    opt.innerText = data[3][i];
                }
                
                // 추가버튼 왼쪽 콤보박스 - 제트팬
                for(let i = 0; i < data[4].length+1; i++) {
                    let opt = document.createElement('option');
                    comment.querySelector('#jetfan').appendChild(opt);
                    opt.innerText = (i === 0) ? '공통' : data[4][i-1];
                }

            } else {
                Swal.fire({
                    title: '데이터 없음!', 
                    text: '해당년도 데이터가 없습니다.',
                    icon: 'info',
                    confirmButtonText: '확인',
                    onAfterClose: () => window.scrollTo(0,0)
                });
                location.reload();
                
            }
            
        } else if(this.status === 500) {
            Swal.fire({
                title: '응답실패', 
                text: '서버응답에 실패하였습니다.',
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
            
            const comment = document.querySelector('#comment');
            for(let i = 0; i < data.length+1; i++) {
                let opt = document.createElement('option');
                comment.querySelector('#jetfan').appendChild(opt);
                opt.innerText = (i === 0) ? '공통' : data[i-1];
            }
        }
    }

    xhttp.open("POST", "/abnormal", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 이미지 미리보기
const showImg = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            previewImg.setAttribute('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

// const fileUpload = (img, file) => {
//     const reader = new FileReader();
//     this.ctrl = createThrobber(img);
//     const xhr = new XMLHttpRequest();
//     this.xhr = xhr;
  
//     const self = this;
//     this.xhr.upload.addEventListener("progress", function(e) {
//           if (e.lengthComputable) {
//             const percentage = Math.round((e.loaded * 100) / e.total);
//             self.ctrl.update(percentage);
//           }
//         }, false);
  
//     xhr.upload.addEventListener("load", function(e){
//             self.ctrl.update(100);
//             const canvas = self.ctrl.ctx.canvas;
//             canvas.parentNode.removeChild(canvas);
//         }, false);

//     xhr.open("POST", "http://demos.hacks.mozilla.org/paul/demos/resources/webservices/devnull.php");
//     xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');

//     reader.onload = function(evt) {
//       xhr.send(evt.target.result);
//     };

//     reader.readAsBinaryString(file);
// }


// 사진추가
const addContent = () => {

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
        const ap_photo = document.querySelector('#myFile').files[0]?.name ?? 'sample.jpg';

        const content = [{
            'ap_way': ap_way,
            'ap_jetfan_no': ap_jetfan_no,
            'ap_comment': ap_comment,
            'ap_photo': ap_photo
        }];
        
        const data = {'tunn_code': tunn_code,
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
                if(data.status.status_code === 200) {
                    Swal.fire({
                        title: '성공', 
                        text: '사진이 정상적으로 추가되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인'
                    });


                    
                    
                    // 참고사진에 추가
                    const photo = document.querySelector('#photo');
                    const delBtn = document.querySelectorAll('.delBtn');
                    const seq = Number(delBtn[delBtn.length-1].dataset.seq)+1;
                    let div = document.createElement('div');
                    let input = document.createElement('input');
                    let button = document.createElement('button');
                    let img = document.createElement('img');
                    let hr = document.createElement('hr');
                    
                    fileUpload(img);

                    
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
                    button.onclick = deleteContent;
                    button.innerText = '삭제';
                    img.classList.add('refImg');
                    img.setAttribute('src', './data/abnormal/' + year + '/' + year_no + '/' + ap_photo);
                    img.setAttribute('alt', ap_photo);

                    div.setAttribute('id', 'div'+seq);
                    input.setAttribute('id', 'input'+seq);
                    button.setAttribute('id', 'btn'+seq);
                    img.setAttribute('id', 'img'+seq);
                    

                    // 추가부분 초기화
                    document.querySelector('#myFile').value = '';
                    document.querySelector('#commentText').value = '';
                    document.querySelector('#previewImg').src = 'http://via.placeholder.com/300x100';


                }
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
    
        const data = {'tunn_code': tunn_code,
                      'year': year,
                      'year_no': year_no,
                      'seq': seq};
    
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.responseText);
                console.log('data :>> ', data);
                if(data.status.status_code === 200) {
                    Swal.fire({
                        title: '사진삭제', 
                        text: '사진이 정상적으로 삭제되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인'
                    });
                    document.querySelector(`#div${seq}`).remove();
                    document.querySelector(`#input${seq}`).remove();
                    document.querySelector(`#btn${seq}`).remove();
                    document.querySelector(`#img${seq}`).remove();

                } else {
                    Swal.fire({
                        title: '사진삭제', 
                        text: '사진을 삭제하는데 실패하였습니다.',
                        icon: 'warning',
                        confirmButtonText: '확인'
                    });
                }
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

    const tunn_code = document.querySelector('#tunnel').value;
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#update').value;

    const contents = [];
    const errorContents = document.querySelectorAll('#error textarea');
    const chkContents = document.querySelectorAll('#chk textarea');

    errorContents.forEach((content, i) => {
        contents.push({'ar_tunn_code': tunn_code,
                       'ar_year': year,
                       'ar_year_no': year_no,
                       'ar_type': 1,
                       'ar_seq': i+1,
                       'ar_content': content.textContent});
    });

    chkContents.forEach((content, i) => {
        contents.push({'ar_tunn_code': tunn_code,
                       'ar_year': year,
                       'ar_year_no': year_no,
                       'ar_type': 2,
                       'ar_seq': i+1,
                       'ar_content': content.textContent});
    });

    console.log('contents :>> ', contents);

    const data = {'tunn_code': tunn_code,
                  'year': year,
                  'year_no': year_no,
                  'data': contents};

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            Swal.fire({
                title: '입력성공', 
                text: '데이터가 정상적으로 입력되었습니다.',
                icon: 'success',
                confirmButtonText: '확인',
                onAfterClose: () => window.scrollTo(0,0)
            });

        }
    }

    xhttp.open("PUT", "/abnormal", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}