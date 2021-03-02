window.onload = () => {
    const permission = parseInt(sessionStorage.permission);
    const supervisor = displaySupervisor(permission);
    if(!supervisor) {
        document.querySelector('#addBtn').addEventListener('click', uploadFile);
        document.querySelector('#submitBtn').addEventListener('click', modifyData);
        document.querySelector('#myFile').addEventListener('change', showImg);
        
    } else {
        document.querySelector('#addBtn').addEventListener('click', disabledInputBtn);
        document.querySelector('#submitBtn').addEventListener('click', disabledInputBtn);
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
    
    let data = {};
    let year = 0; let year_no = 0;
    if(document.querySelector('.tab button.active').textContent === '검색') {
        year = document.querySelector('#search_year').value;
        year_no = document.querySelector('#search_update').value;
        data = {
            'tunn_code': document.querySelector('.non-selected-wrapper a.selected').dataset.value,
            'year': year, 
            'year_no': year_no,
            'option': 'getContent'
        };
    } else {
        year = document.querySelector('#year').value;
        year_no = document.querySelector('#update').value;
        data = {
            'tunn_code': document.querySelector('#tunnel').value,
            'year': year, 
            'year_no': year_no,
            'option': 'getContent'
        };
    }

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

            changeCircleColor(data.update);

            if(data.ph_seq.length > 0) {

                let tunn_name = '';
                if(document.querySelector('.tab button.active').textContent === '검색') {
                    tunn_name = document.querySelector('.non-selected-wrapper a.selected').text.split(' ')[2];
                } else {
                    tunn_name = document.querySelector('#tunnel').selectedOptions[0].textContent;
                }
                document.querySelector('#tunnel_name').innerText = tunn_name + '터널' ?? '';
                document.querySelector('#tunn_ymd').innerText = data['ymd'] ?? '';

                const photoElem = document.querySelector('#photo');
                for(let i = 0; i < data['ph_seq'].length; i++) {
                    let div = document.createElement('div');
                    let input = document.createElement('input');
                    let button = document.createElement('img');
                    let img = document.createElement('img');
                    let hr = document.createElement('hr');
                    photoElem.appendChild(div);
                    photoElem.appendChild(input);
                    photoElem.appendChild(button);
                    photoElem.appendChild(img);
                    photoElem.appendChild(hr);
                    div.innerText = `⊙  ${data['ph_way'][i]} - ${data['ph_jetfan'][i]}` ?? '';
                    div.setAttribute('id', 'div'+data['ph_seq'][i]);
                    input.classList.add('refInput');
                    input.setAttribute('id', 'input'+data['ph_seq'][i]);
                    input.disabled = true;
                    button.classList.add('delBtn');
                    button.setAttribute('id', 'btn'+data['ph_seq'][i]);
                    button.dataset.seq = data['ph_seq'][i];
                    resolveDelete(button);

                    button.src = './img/minus.png';
                    img.classList.add('refImg');
                    img.setAttribute('id', 'img'+data['ph_seq'][i]);
                    input.value = data['ph_comment'][i];
                    img.src = './data/photo/' + year + '/' + year_no + '/' + data['ph_photo'][i];
                    img.setAttribute('alt', data['ph_photo'][i]);
                    hr.setAttribute('id', 'hr'+data['ph_seq'][i]);
                }

            } else {
                const tunn_name = document.querySelector('#tunnel').selectedOptions[0].textContent;
                document.querySelector('#tunnel_name').innerText = tunn_name + '터널' ?? '';
                document.querySelector('#tunn_ymd').innerText = data['ymd'] ?? '';

                const photoElem = document.querySelector('#photo');
                let div = document.createElement('div');
                let input = document.createElement('input');
                let button = document.createElement('img');
                let img = document.createElement('img');
                let hr = document.createElement('hr');
                photoElem.appendChild(div);
                photoElem.appendChild(input);
                photoElem.appendChild(button);
                photoElem.appendChild(img);
                photoElem.appendChild(hr);
                input.classList.add('refInput');
                input.disabled = true;
                button.classList.add('delBtn');
                button.dataset.seq = 0;
                button.src = './img/minus.png';
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
            return false;
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

    let tunn_code = 0;
    if(document.querySelector('.tab button.active').textContent === '검색') {
        tunn_code = document.querySelector('.non-selected-wrapper a.selected').dataset.value;
    } else {
        tunn_code = document.querySelector('#tunnel').value;
    }
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
            return false;
        }
    }

    xhttp.open("POST", "/photo", true);
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
    document.querySelector('#addBtn').removeEventListener('click', uploadFile);
    let year = 0; let year_no = 0; let tunn_code = 0;
    if(document.querySelector('.tab button.active').textContent === '검색') {
        year = document.querySelector('#search_year').value;
        year_no = document.querySelector('#search_update').value;
        tunn_code = document.querySelector('.non-selected-wrapper a.selected').dataset.value;

    } else {
        year = document.querySelector('#year').value;
        year_no = document.querySelector('#update').value;
        tunn_code = document.querySelector('#tunnel').value;
    }
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
                addContent(`p_${tunn_code}_${seq}.jpg`);

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

    xhr.open('POST', '/ptupload');
    xhr.send(fd);
};



// 사진 추가하기
const addContent = (filename) => { 
    let year = 0; let year_no = 0; let tunn_code = 0;
    if(document.querySelector('.tab button.active').textContent === '검색') {
        year = document.querySelector('#search_year').value;
        year_no = document.querySelector('#search_update').value;
        tunn_code = document.querySelector('.non-selected-wrapper a.selected').dataset.value;

    } else {
        year = document.querySelector('#year').value;
        year_no = document.querySelector('#update').value;
        tunn_code = document.querySelector('#tunnel').value;
    }
    const photo_way = document.querySelector('#way').selectedOptions[0].textContent;
    const photo_jetfan_no = document.querySelector('#jetfan').selectedOptions[0].textContent;
    const photo_comment = document.querySelector('#commentText').value ?? '';
    const photo_photo = filename ?? 'sample.jpg';

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
            }).then(() => {
                document.querySelector('#addBtn').addEventListener('click', uploadFile);
            });


            // 비어있는 참고사진 객체 삭제
            if(document.querySelector('#input0')) {
                document.querySelector('#input0').remove();
                document.querySelector('#btn0').remove();
                document.querySelector('#img0').remove();
                document.querySelector('#hr0').remove();
            }

            // 참고사진에 추가
            let seq = 1;
            if(document.querySelectorAll('.delBtn').length) {
                const delBtn = document.querySelectorAll('.delBtn');
                seq = Number(delBtn[delBtn.length-1].dataset.seq)+1;
            }
            const photo = document.querySelector('#photo');
            const img_path = './data/photo/' + year + '/' + year_no + '/';
            const file_name = 'p_' + tunn_code + '_' + seq + '.jpg';
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
            
            div.innerText = `⊙ ${photo_way} - ${photo_jetfan_no}` ?? '';
            input.value = photo_comment;
            input.classList.add('refInput');
            input.disabled = true;
            button.classList.add('delBtn');
            button.dataset.seq = seq;
            resolveDelete(button);
            // button.onclick = deleteContent;
            button.src = './img/minus.png';
            img.classList.add('refImg');
            img.setAttribute('src', img_path + file_name);
            img.setAttribute('alt', photo_photo);

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

    xhttp.open("POST", "/photo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));

}


// 사진삭제
const deleteContent = (e) => {
    if (confirm('정말로 삭제하시겠습니까?')) {

        const seq = e.target.dataset.seq;
        let year = 0; let year_no = 0; let tunn_code = 0;
        if(document.querySelector('.tab button.active').textContent === '검색') {
            year = document.querySelector('#search_year').value;
            year_no = document.querySelector('#search_update').value;
            tunn_code = document.querySelector('.non-selected-wrapper a.selected').dataset.value;

        } else {
            year = document.querySelector('#year').value;
            year_no = document.querySelector('#update').value;
            tunn_code = document.querySelector('#tunnel').value;
        }
    
        const data = {'tunn_code': tunn_code,
                      'year': year,
                      'year_no': year_no,
                      'seq': seq};
    
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.responseText);

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
                    input.disabled = true;
                    button.classList.add('delBtn');
                    button.dataset.seq = 0;
                    // button.onclick = deleteContent;
                    resolveDelete(button);
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
    
        xhttp.open("DELETE", "/photo", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(data));

    } else {
        console.log('삭제취소');
    }
}


// 전체 데이터 반영 (PUT api 요청)	
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


    let year = 0; let year_no = 0; let tunn_code = 0;
    if(document.querySelector('.tab button.active').textContent === '검색') {
        year = document.querySelector('#search_year').value;
        year_no = document.querySelector('#search_update').value;
        tunn_code = document.querySelector('.non-selected-wrapper a.selected').dataset.value;

    } else {
        year = document.querySelector('#year').value;
        year_no = document.querySelector('#update').value;
        tunn_code = document.querySelector('#tunnel').value;
    }

    const contents = [];	
    const comment = document.querySelectorAll('#photo .refInput');	

    comment.forEach((elem, i) => {	
        contents.push({'photo_seq': i+1,	
                       'photo_comment': elem.value });	
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

    xhttp.open("PUT", "/photo", true);	
    xhttp.setRequestHeader('Content-Type', 'application/json');	
    xhttp.send(JSON.stringify(data));	
} 