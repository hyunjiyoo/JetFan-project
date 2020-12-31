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


    // 사용연수지수 *****************************************
    const eval_useyear = document.querySelector('#eval_useyear');
    eval_useyear.addEventListener('change', getUseYear);


    // 사용환경지수 *****************************************
    const eval_snow = document.querySelector('#eval_snow');
    eval_snow.addEventListener('change', getSnow);
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
            
            // 3. 사용연수지수 구하기 위한 제트팬 내구 연수
            document.querySelector('#eval_useyear').dataset.durable = data.jetfan_durable;
            
        }
    }


    xhttp.open("POST", "/evaluation", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

// 제트팬을 선택했는지 여부 판단
const findJetfan = () => {
    return new Promise((resolve, reject) => {
        if(document.querySelector('#jetfan_name').textContent === '') {
            alert('제트팬을 먼저 선택해주세요');
            reject();
        } else {
            resolve();
        }
    });
}


// 1. 작동기능 지수 ###############################
// 진동
const getvibration = () => {
    findJetfan().then(() => {
        // 진동(mm/s)
        let eval_vibrates = Object.values(document.querySelectorAll('.eval_vibrate'));
        let vibrate = eval_vibrates.map((vib) => Number(vib.value))
                        .reduce((a, b) => { return Math.max(a, b); });

        document.querySelector('#vibrate').innerText = vibrate;
        const eval_vibrate_score = document.querySelector('#eval_vibrate_score');

        // 진동점수
        if(vibrate < 3.5) {
            eval_vibrate_score.innerText = 1;
        } else if(vibrate < 4.1) {
            eval_vibrate_score.innerText = 2;
        } else if(vibrate < 6.4) {
            eval_vibrate_score.innerText = 3;
        } else if(vibrate < 10.2) {
            eval_vibrate_score.innerText = 10;
            // 10.2 오류인지 확인필요
        } else if(vibrate >= 10.2) {
            eval_vibrate_score.innerText = 20;
        }

        getOperTotalScore();

    }).catch(() => {
        document.querySelectorAll('.eval_vibrate').forEach((vibrate) => {
            vibrate.value = '';
        });
    });
}

// 운전전류
const getAmp = () => {
    findJetfan().then(() => {

        // 운전전류
        let eval_amps = Object.values(document.querySelectorAll('.eval_amp'));
        let eval_temp = Number(document.querySelector('#eval_temp').value);
        let avg = eval_amps.map((amp) => Number(amp.value)).reduce((a,b) => (a+b))/eval_amps.length;

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
    
    }).catch(() => {
        document.querySelector('#eval_volt').value = '';
        document.querySelectorAll('.eval_amp').forEach((amp) => {
            amp.value = '';
        });
    })
}

// 베어링온도
const getBearTmp = () => {
    findJetfan().then(() => {
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

    }).catch(() => {
        document.querySelector('#eval_beartemp').value = '';
    });
}

// 모터표면온도
const getMotorTmp = () => {
    findJetfan().then(() => {
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
    
    }).catch(() => {
        document.querySelector('#eval_motortemp').value = '';
    })
}

// 모터절연상태
const getMotorStatus = () => {
    findJetfan().then(() => {
        const eval_motorinsul = document.querySelector('#eval_motorinsul').value;
        const eval_motorinsul_score = document.querySelector('#eval_motorinsul_score');

        if(eval_motorinsul >= 1) {
            eval_motorinsul_score.innerText = 1;
        } else if(eval_motorinsul < 1) {
            eval_motorinsul_score.innerText = 20;
        } 

        getOperTotalScore();

    }).catch(() => {
        document.querySelector('#eval_motorinsul').value = '';
    });
}

// 1. 작동기능지수 소계
const getOperTotalScore = () => {
    const ids = ['eval_vibrate_score', 'eval_amp_score', 'eval_beartemp_score', 'eval_motortemp_score', 'eval_motorinsul_score'];
    let sum = 0;
    ids.forEach((id) => {
        sum += Number(document.querySelector(`#${id}`).textContent);
    })

    document.querySelector('#eval_operate_sum').innerText = sum;
    getScoreSum();
    getTwentyItem();
    getGrade();
}
// ###############################################


// 2. 외관점검 지수 ###############################
// 브레이드 이상음 발생여부
const getBraidNoise = () => {
    findJetfan().then(() => {
        const eval_braidnoise = document.querySelectorAll('#eval_braidnoise option')[document.querySelector('#eval_braidnoise').selectedIndex];
        const eval_braidnoise_score = document.querySelector('#eval_braidnoise_score');
        if(eval_braidnoise.text === '없음') {
            eval_braidnoise_score.innerText = 1;
        } else {
            eval_braidnoise_score.innerText = 10;
        }

        geChkAppearanceScore();
    }).catch(() => {
        document.querySelector('#eval_braidnoise').selectedIndex = 0;
    });
}

// 브레이드 파손여부 
const getBraidBroken = () => {
    findJetfan().then(() => {
        const eval_braidbroken = document.querySelectorAll('#eval_braidbroken option')[document.querySelector('#eval_braidbroken').selectedIndex];
        const eval_braidbroken_score = document.querySelector('#eval_braidbroken_score');

        if(eval_braidbroken.text === '없음') {
            eval_braidbroken_score.innerText = 1;
        } else {
            eval_braidbroken_score.innerText = 20;
        }

        geChkAppearanceScore();
        getTwentyItem();

    }).catch(() => {
        document.querySelector('#eval_braidbroken').selectedIndex = 0;
    });
}

// 베어링 이상음 발생여부
const getBearNoise = () => {
    findJetfan().then(() => {
        const eval_bearnoise = document.querySelectorAll('#eval_bearnoise option')[document.querySelector('#eval_bearnoise').selectedIndex];
        const eval_bearnoise_score = document.querySelector('#eval_bearnoise_score');

        if(eval_bearnoise.text === '없음') {
            eval_bearnoise_score.innerText = 1;
        } else {
            eval_bearnoise_score.innerText = 10;
        }

        geChkAppearanceScore();

    }).catch(() => {
        document.querySelector('#eval_bearnoise').selectedIndex = 0;
    });
}

// 케이싱 카바 부식정도
const getCasing = () => {
    findJetfan().then(() => {
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
        getTwentyItem();

    }).catch(() => {
        document.querySelector('#eval_casing').selectedIndex = 0;
    });
}

// 외관 충격 여부
const getExterior  = () => {
    findJetfan().then(() => {
        const eval_exterior = document.querySelectorAll('#eval_exterior option')[document.querySelector('#eval_exterior').selectedIndex];
        const eval_exterior_score = document.querySelector('#eval_exterior_score');

        if(eval_exterior.text === '없음') {
            eval_exterior_score.innerText = 1;
        } else {
            eval_exterior_score.innerText = 10;
        }

        geChkAppearanceScore();

    }).catch(() => {
        document.querySelector('#eval_exterior').selectedIndex = 0;
    });
}

// 턴버클 부식
const getBuckle = () => {
    findJetfan().then(() => {
        const eval_buckle = document.querySelectorAll('#eval_buckle option')[document.querySelector('#eval_buckle').selectedIndex];
        const eval_buckle_score = document.querySelector('#eval_buckle_score');

        if(eval_buckle.text === '양호') {
            eval_buckle_score.innerText = 1;
        } else {
            eval_buckle_score.innerText = 3;
        }

        geChkAppearanceScore();

    }).catch(() => {
        document.querySelector('#eval_buckle').selectedIndex = 0;
    });
}

// 아이볼트 부식
const getEyebolt = () => {
    findJetfan().then(() => {
        const eval_eyebolt = document.querySelectorAll('#eval_eyebolt option')[document.querySelector('#eval_eyebolt').selectedIndex];
        const eval_eyebolt_score = document.querySelector('#eval_eyebolt_score');

        if(eval_eyebolt.text === '양호') {
            eval_eyebolt_score.innerText = 1;
        } else {
            eval_eyebolt_score.innerText = 3;
        }

        geChkAppearanceScore();

    }).catch(() => {
        document.querySelector('#eval_eyebolt').selectedIndex = 0;
    });
}

// 브라켓 체결상태
const getBracket = () => {
    findJetfan().then(() => {
        const eval_bracket = document.querySelectorAll('#eval_bracket option')[document.querySelector('#eval_bracket').selectedIndex];
        const eval_bracket_score = document.querySelector('#eval_bracket_score');

        if(eval_bracket.text === '양호') {
            eval_bracket_score.innerText = 1;
        } else {
            eval_bracket_score.innerText = 3;
        }

        geChkAppearanceScore();
    }).catch(() => {
        document.querySelector('#eval_bracket').selectedIndex = 0;
    });

}

// 앙카볼트 체결상태
const getAnchor = () => {
    findJetfan().then(() => {
        const eval_anchor = document.querySelectorAll('#eval_anchor option')[document.querySelector('#eval_anchor').selectedIndex];
        const eval_anchor_score = document.querySelector('#eval_anchor_score');

        if(eval_anchor.text === '양호') {
            eval_anchor_score.innerText = 1;
        } else {
            eval_anchor_score.innerText = 3;
        }

        geChkAppearanceScore();

    }).catch(() => {
        document.querySelector('#eval_anchor').selectedIndex = 0;
    });
}

// 안전체인 체결상태
const getChain = () => {
    findJetfan().then(() => {
        const eval_chain = document.querySelectorAll('#eval_chain option')[document.querySelector('#eval_chain').selectedIndex];
        const eval_chain_score = document.querySelector('#eval_chain_score');

        if(eval_chain.text === '양호') {
            eval_chain_score.innerText = 1;
        } else {
            eval_chain_score.innerText = 3;
        }

        geChkAppearanceScore();

    }).catch(() => {
        document.querySelector('#eval_chain').selectedIndex = 0;
    });
}

// 2. 외관점검 지수 소계
const geChkAppearanceScore = () => {
    const ids = ['eval_braidnoise_score', 'eval_braidbroken_score', 'eval_bearnoise_score', 
                 'eval_casing_score', 'eval_exterior_score', 'eval_buckle_score', 
                 'eval_eyebolt_score', 'eval_bracket_score', 'eval_anchor_score', 'eval_chain_score'];
    
    let sum = 0;
    ids.forEach((id) => {
        sum += Number(document.querySelector(`#${id}`).textContent);
    });

    eval_exterior_sum.innerText = sum;
    getScoreSum();
    getGrade();
}
// ###############################################


// 3. 사용연수 지수 ###############################
const getUseYear = () => {
    findJetfan().then(() => {
        const eval_useyear = document.querySelector('#eval_useyear');
        const eval_useyear_score = document.querySelector('#eval_useyear_score');
        const jetfan_durable = eval_useyear.dataset.durable;

        const useYearScore = (years) => {
            if(eval_useyear.value <= years[0]) {
                eval_useyear_score.innerText = 1;
            } else if(eval_useyear.value <= years[1]) {
                eval_useyear_score.innerText = 2;
            } else if(eval_useyear.value <= years[2]) {
                eval_useyear_score.innerText = 3;
            } else if(eval_useyear.value <= years[3]) {
                eval_useyear_score.innerText = 10;
            } else if(eval_useyear.value > years[4]) {
                eval_useyear_score.innerText = 20;
            }
            document.querySelector('#eval_useyear_sum').innerText = eval_useyear_score.textContent;
        } 
    
        switch(jetfan_durable) {
            case '12':
                useYearScore([7,8,10,12,12]);
                break;
            
            case '15':
                useYearScore([9,11,13,15,15]);
                break;
    
            case '18':
                useYearScore([10,13,16,18,18]);
                break;
        }
        getScoreSum();
        getTwentyItem();
        getGrade();

    }).catch(() => {
        eval_useyear.value = '';
    });
}
// ###############################################


// 4. 사용환경 지수 ###############################
const getSnow = () => {
    findJetfan().then(() => {
        const eval_snow = document.querySelectorAll('#eval_snow option')[document.querySelector('#eval_snow').selectedIndex];
        const eval_snow_score = document.querySelector('#eval_snow_score');

        if(eval_snow.text === '10일이하') {
            eval_snow_score.innerText = 1;
        } else if(eval_snow.text === '11일이상') {
            eval_snow_score.innerText = 2;
        } else if(eval_snow.text === '15일이상') {
            eval_snow_score.innerText = 3;
        } else if(eval_snow.text === '19일이상') {
            eval_snow_score.innerText = 10;
        } else if(eval_snow.text === '22일이상') {
            eval_snow_score.innerText = 20;
        }
        document.querySelector('#eval_env_sum').innerText = eval_snow_score.textContent;
        getScoreSum();
        getTwentyItem();
        getGrade();

    }).catch(() => {
        document.querySelector('#eval_snow').selectedIndex = 0;
    });
}
// ###############################################

// 총점수 함계 ###############################
const getScoreSum = () => {
    const eval_score_sum = document.querySelector('#eval_score_sum');
    const ids = ['eval_operate_sum','eval_exterior_sum','eval_useyear_sum','eval_env_sum'];
    let sum = 0;
    ids.forEach((id) => {
        sum += Number(document.querySelector(`#${id}`).textContent);
    });

    eval_score_sum.innerText = sum;
}


// (20점 항목수), 팬 등급
const getTwentyItem = () => {
    const eval_twenty = document.querySelector('#eval_twenty');
    let sum = 0;

    // 1. 작동기능지수 중 (진동, 베어링온도, 운전전류, 표면온도, 절연상태) 중 20점 이상인 항목 하나 이상이면 점수 +1
    let operationIds = ['eval_vibrate_score', 'eval_beartemp_score', 'eval_amp_score', 'eval_motortemp_score', 'eval_motorinsul_score'];
    operationIds = operationIds.some((id) => {
        return (Number(document.querySelector(`#${id}`).textContent) === 20);
    });
    if(operationIds) {
        sum++;
    }
    
    // 2. 외관점검지수 (브레이드파손여부, 케이싱 카바부식정도) 중 20점 이상인 항목 하나 이상 있을 경우 +1
    let exteriorIds = ['eval_braidbroken_score', 'eval_casing_score'];
    exteriorIds = exteriorIds.some((id) => {
        return (Number(document.querySelector(`#${id}`).textContent) === 20);
    });
    if(exteriorIds) {
        sum++;
    }

    const eval_useyear_score = document.querySelector('#eval_useyear_score');
    const eval_snow_score = document.querySelector('#eval_snow_score');
    sum += (Number(eval_useyear_score.textContent) === 20) ? 1 : 0;
    sum += (Number(eval_snow_score.textContent) === 20) ? 1 : 0;


    // 판정점수가 2점 이상인 경우 평가표에 "2"로 표시
    if(sum >= 2) {
        eval_twenty.innerText = 2;
    } else {
        eval_twenty.innerText = sum;
    }
    
    
}

// 팬 등급
const getGrade = () => {
    const eval_score_sum = document.querySelector('#eval_score_sum');
    const eval_twenty = document.querySelector('#eval_twenty');
    const eval_grade = document.querySelector('#eval_grade');

    if(eval_twenty.textContent === '2') {
        eval_grade.innerText = 4;

    } else {
        if(eval_score_sum.textContent <= 24) {
            eval_grade.innerText = 1;
        } else if(eval_score_sum.textContent <= 41) {
            eval_grade.innerText = 2;
        } else if(eval_score_sum.textContent <= 117) {
            eval_grade.innerText = 3;
        } else if(eval_score_sum.textContent >= 118) {
            eval_grade.innerText = 4;
        }
    }
}