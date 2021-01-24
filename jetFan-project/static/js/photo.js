window.onload = () => {
    document.querySelector('#addBtn').addEventListener('click', addContent);
    document.querySelector('#submitBtn').addEventListener('click', modifyData);
}

const initData = () => {
    document.querySelector('#tunnel_name').innerText = '';

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

            if(data[0].length > 0) {

                const seq = data[0].filter((elem, i) => i%4===0);
                const jetfan_no = data[0].filter((elem, i) => i%4===1);
                const photo_comment = data[0].filter((elem, i) => i%4===2);
                const photo = data[0].filter((elem, i) => i%4===3);
                
                const photoElem = document.querySelector('#photo')
                for(let i = 0; i < data.length/4; i++) {
                    let div = document.createElement('div');
                    let input = document.createElement('input');
                    let button = document.createElement('button');
                    let img = document.createElement('img');
                    let hr = document.createElement('hr');
                    photoElem.appendChild(div);
                    photoElem.appendChild(input);
                    photoElem.appendChild(button);
                    photoElem.appendChild(img);
                    photoElem.appendChild(hr);
                    div.innerText = '⊙ ' + jetfan_no[i] ?? '';
                    div.setAttribute('id', 'div'+seq[i]);
                    input.classList.add('refInput');
                    input.setAttribute('id', 'input'+seq[i]);
                    button.classList.add('delBtn');
                    button.setAttribute('id', 'btn'+seq[i]);
                    button.dataset.seq = seq[i];
                    button.onclick = deleteContent;
                    img.classList.add('refImg');
                    img.setAttribute('id', 'img'+seq[i]);
                    input.value = photo_comment[i];
                    button.innerText = '삭제';
                    img.setAttribute('src', './data/photo/' + year + '/' + year_no + '/' + photo[i]);
                    img.setAttribute('alt', photo[i]);
                }

                // 추가버튼 왼쪽 콤보박스 - 방향
                const comment = document.querySelector('#comment');
                for(let i =0; i < data[1].length; i++) {
                    let opt = document.createElement('option');
                    comment.querySelector('#way').appendChild(opt);
                    opt.innerText = data[1][i];
                }

                // 추가버튼 왼쪽 콤보박스 - 제트팬
                for(let i = 0; i < data[2].length+1; i++) {
                    let opt = document.createElement('option');
                    comment.querySelector('#jetfan').appendChild(opt);
                    opt.innerText = (i === 0) ? '공통' : data[2][i-1];
                }
            } else {
                Swal.fire({
                    title: '데이터 없음!', 
                    text: '데이터가 존재하지 않습니다.',
                    icon: 'info',
                    confirmButtonText: '확인'
                });
                location.reload();
            }

        } else if(this.status === 500) {
            Swal.fire({
                ttitle: '응답실패', 
                text: '서버응답에 실패하였습니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            });

            location.reload();
        }
    }

    xhttp.open("POST", "/photo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


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

    xhttp.open("POST", "/photo", true);
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

// 사진 추가하기
const addContent = () => { 
    const tunn_code = document.querySelector('#tunnel').value;
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#update').value;
    const photo_way = document.querySelector('#way').selectedOptions[0].textContent;
    const photo_jetfan_no = document.querySelector('#jetfan').selectedOptions[0].textContent;
    const photo_comment = document.querySelector('#commentText').value ?? '';
    const photo_photo = document.querySelector('#myFile').files[0]?.name ?? 'sample.jpg';

    const content = [{
        'photo_way': photo_way,
        'photo_jetfan_no': photo_jetfan_no,
        'photo_comment': photo_comment,
        'photo_photo': photo_photo
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
            console.log('data :>> ', data);
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
                
                photo.appendChild(div);
                photo.appendChild(input);
                photo.appendChild(button);
                photo.appendChild(img);
                photo.appendChild(hr);
                div.innerText = '⊙ ' + photo_way + ' - ' + photo_jetfan_no ?? '';
                input.value = photo_comment;
                input.classList.add('refInput');
                button.classList.add('delBtn');
                button.dataset.seq = seq;
                button.onclick = deleteContent;
                button.innerText = '삭제';
                img.classList.add('refImg');
                img.setAttribute('src', './data/abnormal/' + year + '/' + year_no + '/' + photo_photo);
                img.setAttribute('alt', photo_photo);

                div.setAttribute('id', 'div'+seq);
                input.setAttribute('id', 'input'+seq);
                button.setAttribute('id', 'btn'+seq);
                img.setAttribute('id', 'img'+seq);
                

                // 추가부분 초기화
                document.querySelector('#myFile').value = '';
                document.querySelector('#commentText').value = '';
                document.querySelector('#previewImg').src = 'http://via.placeholder.com/300x100';

            }  else if(data.status.status_code === 500) {
                Swal.fire({
                    title: '실패', 
                    text: '서버 응답에 실패하였습니다.',
                    icon: 'warning',
                    confirmButtonText: '확인'
                });
            }
        }
    }

    xhttp.open("POST", "/photo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));

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
    
        xhttp.open("DELETE", "/photo", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));

    } else {
        console.log('삭제취소');
    }
}


// 전체 데이터 반영 (PUT api 요청)
const modifyData = () => {

    // const tunn_code = document.querySelector('#tunnel').value;
    // const year = document.querySelector('#year').value;
    // const year_no = document.querySelector('#update').value;

    // const contents = [];
    // const errorContents = document.querySelectorAll('#photo textarea');

    // errorContents.forEach((content, i) => {
    //     contents.push({'photo_tunn_code': tunn_code,
    //                    'photo_year': year,
    //                    'photo_year_no': year_no,
    //                    'photo_type': 1,
    //                    'photo_seq': i+1,
    //                    'photo_content': content.textContent});
    // });

    // console.log('contents :>> ', contents);

    // const data = {'tunn_code': tunn_code,
    //               'year': year,
    //               'year_no': year_no,
    //               'data': contents};

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            Swal.fire({
                title: '입력성공', 
                text: '데이터가 정상적으로 입력되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
            });

        } else if(this.status === 500) {
            Swal.fire({
                title: '입력실패', 
                text: '데이터 입력에 실패되었습니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
        }
    }

    xhttp.open("PUT", "/photo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}