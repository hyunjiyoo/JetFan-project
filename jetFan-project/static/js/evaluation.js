window.onload = () => {

    // 작동기능지수 *****************************************
    // 진동
    const eval_vibrates = document.querySelectorAll('.eval_vibrate');
    eval_vibrates.forEach((vib) => {
        vib.addEventListener('change', getvibration);
    });

    // 운전전류, 전압
    const eval_amps = document.querySelectorAll('.eval_amp');
    const eval_volt = document.querySelector('#eval_volt');
    const eval_temp = document.querySelector('#eval_temp');
    eval_volt.addEventListener('change', getAmp);
    eval_temp.addEventListener('change', getAmp);
    eval_amps.forEach((eval_amp) => {
        eval_amp.addEventListener('change', getAmp);
    });

    // 베어링 온도
    const eval_beartemp = document.querySelector('#eval_beartemp');
    eval_beartemp.addEventListener('change', getBearTmp);
    
    // 모터표면온도
    const eval_motortemp = document.querySelector('#eval_motortemp');
    eval_motortemp.addEventListener('change', getMotorTmp);

    // 모터절연상태
    const eval_motorinsul = document.querySelector('#eval_motorinsul');
    eval_motorinsul.addEventListener('change', getMotorStatus);


    // 외관점검지수 *****************************************
    // 브레이드 이상음 발생여부
    const eval_braidnoise = document.querySelector('#eval_braidnoise');
    eval_braidnoise.addEventListener('change', getBraidNoise);
    
    // 브레이드 파손여부
    const eval_braidbroken = document.querySelector('#eval_braidbroken');
    eval_braidbroken.addEventListener('change', getBraidBroken);
    
    // 베어링 이상음 발생여부
    const eval_bearnoise = document.querySelector('#eval_bearnoise');
    eval_bearnoise.addEventListener('change', getBearNoise);

    // 케이싱 카바 부식정도
    const eval_casing = document.querySelector('#eval_casing');
    eval_casing.addEventListener('change', getCasing);

    // 외관 충격 여부
    const eval_exterior = document.querySelector('#eval_exterior');
    eval_exterior.addEventListener('change', getExterior);

    // 턴버클 부식
    const eval_buckle = document.querySelector('#eval_buckle');
    eval_buckle.addEventListener('change', getBuckle);

    // 아이볼트부식
    const eval_eyebolt = document.querySelector('#eval_eyebolt');
    eval_eyebolt.addEventListener('change', getEyebolt);

    // 브라켓 체결상태
    const eval_bracket = document.querySelector('#eval_bracket');
    eval_bracket.addEventListener('change', getBracket);

    // 앙카볼트 체결상태
    const eval_anchor = document.querySelector('#eval_anchor');
    eval_anchor.addEventListener('change', getAnchor);

    // 안전체인 체결상태
    const eval_chain = document.querySelector('#eval_chain');
    eval_chain.addEventListener('change', getChain);


}


const getData = () => {
    const jetfan_code = document.querySelector('#jetfan_no').value;
    const data = { 'jetfan_code': jetfan_code };
    console.log('data :>> ', data);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);
            
            // 선택한 제트팬에 대한 기본 데이터
            document.querySelector('#tunn_name').innerText = data.tunn_name;
            document.querySelector('#way').innerText = data.jetfan_way;
            document.querySelector('#lane').innerText = data.jetfan_lane;
            document.querySelector('#jetfan_name').innerText = data.jetfan_no;
        }
    }


    xhttp.open("POST", "/evaluation", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}


// 1. 작동기능 지수 ###############################
// 진동
const getvibration = () => {
    // 진동(mm/s)
    let eval_vibrates = Object.values(document.querySelectorAll('.eval_vibrate'));
    let vibrate = eval_vibrates.map((vib) => Number(vib.value))
                      .reduce((a, b) => { return Math.max(a, b); });

    document.querySelector('#vibrate').innerText = vibrate;
    const eval_vibrate_score = document.querySelector('#eval_vibrate_score');

    // 진동점수
    if(vibrate < 3.5) {
        eval_vibrate_score.innerText = 1;
    } else if(vibrate <= 4.0) {
        eval_vibrate_score.innerText = 2;
    } else if(vibrate <= 6.3) {
        eval_vibrate_score.innerText = 3;
    } else if(vibrate <= 8.3) {
        eval_vibrate_score.innerText = 10;
        // 10.2 오류인지 확인필요
    } else if(vibrate >= 10.2) {
        eval_vibrate_score.innerText = 20;
    }

    getOperTotalScore();
}

// 운전전류
const getAmp = () => {
    // 운전전류
    let currents = Object.values(document.querySelectorAll('.current'));
    let eval_temp = Number(document.querySelector('#eval_temp').value);
    let avg = currents.map((cur) => Number(cur.value)).reduce((a,b) => (a+b))/currents.length;

    // 터널온도에 따른 전류값 보정
    if(eval_temp <= -15) {
        avg *= 1.136;
    } else if(eval_temp <= -10) {
        avg *= 1.114;
    } else if(eval_temp <= -5) {
        avg *= 1.094;
    } else if(eval_temp <= 0) {
        avg *= 1.074;
    } else {
        avg = avg;
    }

    // 측정전압, 정격전압
    const eval_volt = document.querySelector('#eval_volt').value;
    const V = 380;

    const operCurr = (avg * eval_volt) / V;
    document.querySelector('#eval_amp').innerText = operCurr.toFixed(1);
    const eval_amp_score = document.querySelector('#eval_amp_score');

    if(operCurr <= 90) {
        eval_amp_score.innerText = 1;
    } else if(operCurr <= 92) {
        eval_amp_score.innerText = 2;
    } else if(operCurr <= 95) {
        eval_amp_score.innerText = 3;
    } else if(operCurr <= 100) {
        eval_amp_score.innerText = 10;
    } else if(operCurr > 100) {
        eval_amp_score.innerText = 20;
    }

    getOperTotalScore();
}

// 베어링온도
const getBearTmp = () => {
    const bearTmp = document.querySelector('#eval_beartemp').value;
    const eval_beartemp_score = document.querySelector('#eval_beartemp_score');

    if(bearTmp <= 35) {
        eval_beartemp_score.innerText = 1;
    } else if(bearTmp <= 40) {
        eval_beartemp_score.innerText = 2;
    } else if(bearTmp <= 50) {
        eval_beartemp_score.innerText = 3;
    } else if(bearTmp <= 60) {
        eval_beartemp_score.innerText = 10;
    } else if(bearTmp <= 70) {
        eval_beartemp_score.innerText = 20;
    }

    getOperTotalScore();
}

// 모터표면온도
const getMotorTmp = () => {
    const eval_motortemp = document.querySelector('#eval_motortemp').value;
    const eval_motortemp_score = document.querySelector('#eval_motortemp_score');

    if(eval_motortemp <= 50) {
        eval_motortemp_score.innerText = 1;
    } else if(eval_motortemp <= 60) {
        eval_motortemp_score.innerText = 2;
    } else if(eval_motortemp <= 70) {
        eval_motortemp_score.innerText = 3;
    } else if(eval_motortemp <= 100) {
        eval_motortemp_score.innerText = 10;
    } else if(eval_motortemp <= 125) {
        eval_motortemp_score.innerText = 20;
    }

    getOperTotalScore();
}

// 모터절연상태
const getMotorStatus = () => {
    const eval_motorinsul = document.querySelector('#eval_motorinsul').value;
    const eval_motorinsul_score = document.querySelector('#eval_motorinsul_score');

    if(eval_motorinsul >= 1) {
        eval_motorinsul_score.innerText = 1;
    } else if(eval_motorinsul < 1) {
        eval_motorinsul_score.innerText = 20;
    } 

    getOperTotalScore();
}

// 작동기능지수 소계
const getOperTotalScore = () => {
    const ids = ['eval_vibrate_score', 'eval_amp_score', 'eval_beartemp_score', 'eval_motortemp_score', 'eval_motorinsul_score'];
    let sum = 0;
    ids.forEach((id) => {
        sum += Number(document.querySelector(`#${id}`).textContent);
    })

    document.querySelector('#eval_operate_sum').innerText = sum;
}
// ###############################################


// 2. 외관점검 지수 ###############################
// 브레이드 이상음 발생여부
const getBraidNoise = () => {
    const eval_braidnoise = document.querySelectorAll('#eval_braidnoise option')[document.querySelector('#eval_braidnoise').selectedIndex];
    const eval_braidnoise_score = document.querySelector('#eval_braidnoise_score');
    if(eval_braidnoise.text === '없음') {
        eval_braidnoise_score.innerText = 1;
    } else {
        eval_braidnoise_score.innerText = 10;
    }

    geChkAppearanceScore();
}

// 브레이드 파손여부 
const getBraidBroken = () => {
    const eval_braidbroken = document.querySelectorAll('#eval_braidbroken option')[document.querySelector('#eval_braidbroken').selectedIndex];
    const eval_braidbroken_score = document.querySelector('#eval_braidbroken_score');

    if(eval_braidbroken.text === '없음') {
        eval_braidbroken_score.innerText = 1;
    } else {
        eval_braidbroken_score.innerText = 20;
    }

    geChkAppearanceScore();
}

// 베어링 이상음 발생여부
const getBearNoise = () => {
    const eval_bearnoise = document.querySelectorAll('#eval_bearnoise option')[document.querySelector('#eval_bearnoise').selectedIndex];
    const eval_bearnoise_score = document.querySelector('#eval_bearnoise_score');

    if(eval_bearnoise.text === '없음') {
        eval_bearnoise_score.innerText = 1;
    } else {
        eval_bearnoise_score.innerText = 10;
    }

    geChkAppearanceScore();
}

// 케이싱 카바 부식정도
const getCasing = () => {
    const eval_casing = document.querySelectorAll('#eval_casing option')[document.querySelector('#eval_casing').selectedIndex];
    const eval_casing_score = document.querySelector('#eval_casing_score');

    if(eval_casing.text === '없음') {
        eval_casing_score.innerText = 1;
    } else if(eval_casing.text === '25%') {
        eval_casing_score.innerText = 2;
    } else if(eval_casing.text === '50%') {
        eval_casing_score.innerText = 3;
    } else if(eval_casing.text === '100%') {
        eval_casing_score.innerText = 10;
    } else if(eval_casing.text === '천공_낙하물') {
        eval_casing_score.innerText = 20;
    }

    geChkAppearanceScore();
}

// 외관 충격 여부
const getExterior  = () => {
    const eval_exterior = document.querySelectorAll('#eval_exterior option')[document.querySelector('#eval_exterior').selectedIndex];
    const eval_exterior_score = document.querySelector('#eval_exterior_score');

    if(eval_exterior.text === '없음') {
        eval_exterior_score.innerText = 1;
    } else {
        eval_exterior_score.innerText = 10;
    }

    geChkAppearanceScore();
}

// 턴버클 부식
const getBuckle = () => {
    const eval_buckle = document.querySelectorAll('#eval_buckle option')[document.querySelector('#eval_buckle').selectedIndex];
    const eval_buckle_score = document.querySelector('#eval_buckle_score');

    if(eval_buckle.text === '양호') {
        eval_buckle_score.innerText = 1;
    } else {
        eval_buckle_score.innerText = 3;
    }

    geChkAppearanceScore();
}

// 아이볼트 부식
const getEyebolt = () => {
    const eval_eyebolt = document.querySelectorAll('#eval_eyebolt option')[document.querySelector('#eval_eyebolt').selectedIndex];
    const eval_eyebolt_score = document.querySelector('#eval_eyebolt_score');

    if(eval_eyebolt.text === '양호') {
        eval_eyebolt_score.innerText = 1;
    } else {
        eval_eyebolt_score.innerText = 3;
    }

    geChkAppearanceScore();
}

// 브라켓 체결상태
const getBracket = () => {
    const eval_bracket = document.querySelectorAll('#eval_bracket option')[document.querySelector('#eval_bracket').selectedIndex];
    const eval_bracket_score = document.querySelector('#eval_bracket_score');

    if(eval_bracket.text === '양호') {
        eval_bracket_score.innerText = 1;
    } else {
        eval_bracket_score.innerText = 3;
    }

    geChkAppearanceScore();
}

// 앙카볼트 체결상태
const getAnchor = () => {
    const eval_anchor = document.querySelectorAll('#eval_anchor option')[document.querySelector('#eval_anchor').selectedIndex];
    const eval_anchor_score = document.querySelector('#eval_anchor_score');

    if(eval_anchor.text === '양호') {
        eval_anchor_score.innerText = 1;
    } else {
        eval_anchor_score.innerText = 3;
    }

    geChkAppearanceScore();
}

// 안전체인 체결상태
const getChain = () => {
    const eval_chain = document.querySelectorAll('#eval_chain option')[document.querySelector('#eval_chain').selectedIndex];
    const eval_chain_score = document.querySelector('#eval_chain_score');

    if(eval_chain.text === '양호') {
        eval_chain_score.innerText = 1;
    } else {
        eval_chain_score.innerText = 3;
    }

    geChkAppearanceScore();
}

// 외관점검 지수 소계
const geChkAppearanceScore = () => {
    const ids = ['eval_braidnoise_score', 'eval_braidbroken_score', 'eval_bearnoise_score', 
                 'eval_casing_score', 'eval_exterior_score', 'eval_buckle_score', 
                 'eval_eyebolt_score', 'eval_bracket_score', 'eval_anchor_score', 'eval_chain_score'];
    
    let sum = 0;
    ids.forEach((id) => {
        sum += Number(document.querySelector(`#${id}`).textContent);
    });

    eval_exterior_sum.innerText = sum;
}
// ###############################################

