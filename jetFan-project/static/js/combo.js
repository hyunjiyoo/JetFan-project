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
    const data = { 'div_code': _target.value, 'div': _nextTarget.dataset.div };
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);
            switch(nextTarget) {
                case 'branch':
                    const bran_name = data.filter((elem, i) => i%2===0);
                    const bran_code = data.filter((elem, i) => i%2===1);
        
                    for(let j = 0; j < data.length/2; j++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#${nextTarget}`).appendChild(opt);
                        opt.innerText = bran_name[j];
                        opt.value = bran_code[j];
                    }
                    break;
                
                case 'tunnel':
                    const tunn_name = data.filter((elem, i) => i%2===0);
                    const tunn_code = data.filter((elem, i) => i%2===1);

                    for(let j = 0; j < data.length/2; j++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#${nextTarget}`).appendChild(opt);
                        opt.innerText = tunn_name[j];
                        opt.value = tunn_code[j];
                    }
                    break;
                
                case 'jetfan_no':
                    const jetfan_no = data.filter((elem, i) => i%3===0);
                    const jetfan_code = data.filter((elem, i) => i%3===1);
                    const jetfan_way = data.filter((elem, i) => i%3===2).filter((x, i, a) => a.indexOf(x) == i);;


                    console.log('jetfan_way :>> ', jetfan_way);

                    // 방향
                    document.querySelector('#wayOption1 + label').innerText = jetfan_way[0] ?? '방향';
                    document.querySelector('#wayOption2 + label').innerText = jetfan_way[1] ?? '방향';

                    for(let j = 0; j < data.length/3; j++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#${nextTarget}`).appendChild(opt);
                        opt.innerText = jetfan_no[j];
                        opt.value = jetfan_code[j];
                    }
                    
                    break;

                
            }
        }
    }

    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}
