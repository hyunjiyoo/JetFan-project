window.onload = () => {
    document.querySelector('#addBtn').addEventListener('click', addContent);
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
                  'year_no': year_no};

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data22222 :>> ', data);

            if(data[0].length & data[1].length & data[2].length) {
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
                const ap_seq = data[2].filter((elem, i) => i%4===0);
                const ap_jetfan_no = data[2].filter((elem, i) => i%4===1);
                const ap_comment = data[2].filter((elem, i) => i%4===2);
                const ap_photo = data[2].filter((elem, i) => i%4===3);
                
                console.log('ap_jetfan_no :>> ', ap_jetfan_no);
                const photo = document.querySelector('#photo');
                const comment = document.querySelector('#comment');
                for(let i = 0; i < data[2].length/4; i++) {
                    let input = document.createElement('input');
                    let button = document.createElement('button');
                    let img = document.createElement('img');
                    let hr = document.createElement('hr');
                    photo.appendChild(input);
                    photo.appendChild(button);
                    photo.appendChild(img);
                    photo.appendChild(hr);
                    input.classList.add('refInput');
                    button.classList.add('delBtn');
                    img.classList.add('refImg');
                    input.value = ap_comment[i];
                    button.innerText = '삭제';
                    img.setAttribute('src', './data/abnormal/' + year + '/' + year_no + '/' + ap_photo[i]);
                    img.setAttribute('alt', ap_photo[i]);

                    
                    let opt = document.createElement('option');
                    comment.querySelector('select').appendChild(opt);
                    opt.innerText = ap_jetfan_no[i];
                    if(ap_jetfan_no[i] === '공통') {
                        opt.selected = true;
                        // document.querySelector('#commentText').value = ap_comment[i];
                    }
                }



            } else {
                alert('데이터가 존재하지 않습니다.');
                location.reload();
                
            }
            
        } else if(this.status === 500) {
            alert('서버응답 실패');
        }
    }

    xhttp.open("POST", "/abnormal", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
};


// 사진추가
const addContent = () => {

    const opts = document.querySelector('#comment option');
    if(opts === null) {
        alert('데이터 조회버튼을 먼저 눌러주세요.');
        
    } else {
        alert('사진 추가');
        
    }
}