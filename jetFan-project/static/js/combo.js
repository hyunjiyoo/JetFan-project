// 콤보박스 세팅
const setComboBox = (target, nextTarget) => {
    const opt = document.querySelectorAll(`#${nextTarget} option`);
    if(opt.length > 1) {
        for(let i = opt.length-1; i > 0; i--) {
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
                
                case 'jetfan_way':
                    const jetfan_way = data.filter((x, i, a) => a.indexOf(x) == i);
                    
                    for(let j = 0; j < jetfan_way.length; j++) {
                        let opt = document.createElement('option');
                        document.querySelector(`#${nextTarget}`).appendChild(opt);
                        opt.innerText = jetfan_way[j];
                    }
                    break;
                
                case 'jetfan_no':
                    const ways = data.filter((elem, i) => i%4===1);
                    const selectWay = document.querySelectorAll('#jetfan_way option')[document.querySelector('#jetfan_way').selectedIndex].text;
                    let jetfan_no = data.filter((elem, i) => i%4===0);
                    let jetfan_code = data.filter((elem, i) => i%4===2);
                    let jetfan_diagram = data.filter((elem, i) => i%4===3);

                    jetfan_no = jetfan_no.filter((elem, i)=>{ if(ways[i] === selectWay) return jetfan_no[i]; });
                    jetfan_code = jetfan_code.filter((elem, i)=>{ if(ways[i] === selectWay) return jetfan_code[i]; });
                    jetfan_diagram = jetfan_diagram.filter((elem, i)=>{ if(ways[i] === selectWay) return jetfan_diagram[i]; });

                    for(let j = jetfan_no.length-1; j >= 0; j--) {
                        let opt = document.createElement('option');
                        document.querySelector(`#${nextTarget}`).appendChild(opt);
                        opt.innerText = jetfan_no[jetfan_no.length-1-j];
                        opt.value = jetfan_code[jetfan_no.length-1-j];
                        opt.dataset.diagram = jetfan_diagram[jetfan_no.length-1-j];
                    }
                    
                    break;
            }
        }
    }

    xhttp.open("POST", "/combo", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}
