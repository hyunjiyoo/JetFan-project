window.onload = () => {
    // 진동
    const vibDatas = document.querySelectorAll('.vibData');
    vibDatas.forEach((vib) => {
        vib.addEventListener('change', getvibration);
    });

    // 운전전류, 전압
    const currents = document.querySelectorAll('.current');
    const volt = document.querySelector('#volt');
    const tunnTmp = document.querySelector('#tunnTmp');
    volt.addEventListener('change', getCurrent);
    tunnTmp.addEventListener('change', getCurrent);
    currents.forEach((current) => {
        current.addEventListener('change', getCurrent);
    });

    // 베어링 온도
    const bearingTemp = document.querySelector('#bearingTemp');
    bearingTemp.addEventListener('change', getBearTmp);
    
    // 모터표면온도
    const motorSurfTmp = document.querySelector('#motorSurfTmp');
    motorSurfTmp.addEventListener('change', getMotorSurfTmp);

    // 모터절연상태
    const motorStatus = document.querySelector('#motorStatus');
    motorStatus.addEventListener('change', getMotorStatus);

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


// 진동
const getvibration = () => {
    // 진동(mm/s)
    let vibDatas = Object.values(document.querySelectorAll('.vibData'));
    let vibrate = vibDatas.map((vib) => Number(vib.value))
                      .reduce((a, b) => { return Math.max(a, b); });

    document.querySelector('#vibrate').innerText = vibrate;
    const vibScore = document.querySelector('#vibScore');

    // 진동점수
    if(vibrate < 3.5) {
        vibScore.innerText = 1;
    } else if(vibrate <= 4.0) {
        vibScore.innerText = 2;
    } else if(vibrate <= 6.3) {
        vibScore.innerText = 3;
    } else if(vibrate <= 8.3) {
        vibScore.innerText = 10;
        // 10.2 오류인지 확인필요
    } else if(vibrate >= 10.2) {
        vibScore.innerText = 20;
    }

    getOperTotalScore();
}


// 운전전류
const getCurrent = () => {
    // 운전전류
    let currents = Object.values(document.querySelectorAll('.current'));
    let tunnTmp = Number(document.querySelector('#tunnTmp').value);
    let avg = currents.map((cur) => Number(cur.value)).reduce((a,b) => (a+b))/currents.length;

    // 터널온도에 따른 전류값 보정
    if(tunnTmp <= -15) {
        avg *= 1.136;
    } else if(tunnTmp <= -10) {
        avg *= 1.114;
    } else if(tunnTmp <= -5) {
        avg *= 1.094;
    } else if(tunnTmp <= 0) {
        avg *= 1.074;
    } else {
        avg = avg;
    }

    // 측정전압, 정격전압
    const volt = document.querySelector('#volt').value;
    const V = 380;

    const operCurr = (avg * volt) / V;
    document.querySelector('#motorCurr').innerText = operCurr.toFixed(1);
    const motorCurrScore = document.querySelector('#motorCurrScore');

    if(operCurr <= 90) {
        motorCurrScore.innerText = 1;
    } else if(bearTmp <= 92) {
        motorCurrScore.innerText = 2;
    } else if(bearTmp <= 95) {
        motorCurrScore.innerText = 3;
    } else if(bearTmp <= 100) {
        motorCurrScore.innerText = 10;
    } else if(bearTmp > 100) {
        motorCurrScore.innerText = 20;
    }

    getOperTotalScore();
}


// 베어링온도
const getBearTmp = () => {
    const bearTmp = document.querySelector('#bearingTemp').value;
    const bearTmpScore = document.querySelector('#bearTmpScore');

    if(bearTmp <= 35) {
        bearTmpScore.innerText = 1;
    } else if(bearTmp <= 40) {
        bearTmpScore.innerText = 2;
    } else if(bearTmp <= 50) {
        bearTmpScore.innerText = 3;
    } else if(bearTmp <= 60) {
        bearTmpScore.innerText = 10;
    } else if(bearTmp <= 70) {
        bearTmpScore.innerText = 20;
    }

    getOperTotalScore();
}


// 모터표면온도
const getMotorSurfTmp = () => {
    const motorSurfTmp = document.querySelector('#motorSurfTmp').value;
    const motorSurfTmpScore = document.querySelector('#motorSurfTmpScore');

    if(motorSurfTmp <= 50) {
        motorSurfTmpScore.innerText = 1;
    } else if(motorSurfTmp <= 60) {
        motorSurfTmpScore.innerText = 2;
    } else if(motorSurfTmp <= 70) {
        motorSurfTmpScore.innerText = 3;
    } else if(motorSurfTmp <= 100) {
        motorSurfTmpScore.innerText = 10;
    } else if(motorSurfTmp <= 125) {
        motorSurfTmpScore.innerText = 20;
    } 

    getOperTotalScore();
}


// 모터절연상태
const getMotorStatus = () => {
    const motorStatus = document.querySelector('#motorStatus').value;
    const motorStatusScore = document.querySelector('#motorStatusScore');

    if(motorStatus >= 1) {
        motorStatusScore.innerText = 1;
    } else if(motorStatus < 1) {
        motorStatusScore.innerText = 20;
    } 

    getOperTotalScore();
}

// 1.작동기능지수 소계
const getOperTotalScore = () => {
    const vibScore = Number(document.querySelector('#vibScore').textContent);
    const motorCurrScore = Number(document.querySelector('#motorCurrScore').textContent);
    const bearTmpScore = Number(document.querySelector('#bearTmpScore').textContent);
    const motorSurfTmpScore = Number(document.querySelector('#motorSurfTmpScore').textContent);
    const motorStatusScore = Number(document.querySelector('#motorStatusScore').textContent);
    const firstTotalScore = document.querySelector('#firstTotalScore');

    firstTotalScore.innerText = vibScore + motorCurrScore + bearTmpScore + motorSurfTmpScore + motorStatusScore;
}