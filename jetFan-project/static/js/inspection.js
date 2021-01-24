window.onload = () => {

    const accs = document.querySelectorAll(".accordion");
    accs.forEach( acc => {
        acc.addEventListener("click", function() {
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        });
    });

}


const getData = () => {

    const tunn_code = document.querySelector('#tunnel').value;
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#update').value;

    const data = {
        'tunn_code': tunn_code,
        'year': year,
        'year_no': year_no
    };

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);


            document.querySelector('#tunn_name').innerText = data['tunn_name'];
            document.querySelector('#way1').innerText = data['tunn_way1'];
            document.querySelector('#way2').innerText = data['tunn_way2'];
            document.querySelector('#way1_jetfan').innerText = data['way1_jetfan'];
            document.querySelector('#way2_jetfan').innerText = data['way2_jetfan'];
            document.querySelector('#tunn_spec').innerText = data['tunn_spec'];
            document.querySelector('#ins_company').innerText = data['ins_company'];
            document.querySelector('#ins_emp').innerText = data['ins_emp'];
            
            // 점검내용
            for(let i = 11; i <=30; i++) {
                document.querySelector(`#ins_${i}a`).value = data[`ins_${i}a`];
                document.querySelector(`#ins_${i}b`).value = data[`ins_${i}b`];
            }
            
            for(let i = 1; i < 6; i++) {
                document.querySelector(`#ins_etc${i}`).value = data[`ins_etc${i}`];
            }
            

            

        } else if(this.status === 500) {
            Swal.fire({
                title: '응답실패', 
                text: '서버응답에 실패하였습니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
        }
    }

    xhttp.open('POST', '/inspection', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}