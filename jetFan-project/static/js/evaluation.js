window.onload = () => {

    const inputBtn = document.querySelector('#inputBtn');
    inputBtn.addEventListener('click', inputData);

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
    const jetfan_no = document.querySelector('#jetfan_no').value;
    const year = String(document.querySelector('#year').value-1);
    const year_no = document.querySelector('#eval_update').value;
    const data = { 'jetfan_no': jetfan_no, 'year': year , 'year_no': year_no };
    console.log('data :>> ', data);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);
            if(data.length === 0) {
                alert('전년도 데이터가 없습니다.');

            } else {
                // 선택한 제트팬에 대한 기본 데이터
                document.querySelector('#tunn_name').innerText = data.tunn_name;
                document.querySelector('#way').innerText = data.jetfan_way;
                document.querySelector('#lane').innerText = data.jetfan_lane;
                document.querySelector('#jetfan_name').innerText = data.jetfan_no;
                document.querySelector('#jetfan_name').dataset.update = data.eval_update;
                
                // 전년도 데이터 뿌려주기
                // 1. 작동기능 지수 - 진동
                document.querySelector('#eval_vibrate_y_1').value = data.eval_vibrate_y_1;
                document.querySelector('#eval_vibrate_x_1').value = data.eval_vibrate_x_1;
                document.querySelector('#eval_vibrate_z_1').value = data.eval_vibrate_z_1;
                document.querySelector('#eval_vibrate_y_2').value = data.eval_vibrate_y_2;
                document.querySelector('#eval_vibrate_x_2').value = data.eval_vibrate_x_2;
                document.querySelector('#eval_vibrate_z_2').value = data.eval_vibrate_z_2;
                document.querySelector('#eval_vibrate').innerText = data.eval_vibrate;
                document.querySelector('#eval_vibrate_score').innerText = data.eval_vibrate_score;
                
                // 1. 작동기능 지수 - 운전전류
                document.querySelector('#eval_amp_r').value = data.eval_amp_r;
                document.querySelector('#eval_amp_s').value = data.eval_amp_s;
                document.querySelector('#eval_amp_t').value = data.eval_amp_t;
                document.querySelector('#eval_temp').value = data.eval_temp;
                document.querySelector('#eval_amp').innerText = data.eval_amp;
                document.querySelector('#eval_amp_score').innerText = data.eval_amp_score;
                
                
                // 1. 작동기능 지수 - 베어링온도, 모터표면온도, 절연상태, 전압
                document.querySelector('#eval_beartemp').value = data.eval_beartemp;
                document.querySelector('#eval_beartemp_score').innerText = data.eval_beartemp_score;
                document.querySelector('#eval_motortemp').value = data.eval_motortemp;
                document.querySelector('#eval_motortemp_score').innerText = data.eval_motortemp_score;
                document.querySelector('#eval_motorinsul').value = data.eval_motorinsul;
                document.querySelector('#eval_motorinsul_score').innerText = data.eval_motorinsul_score;
                document.querySelector('#eval_volt').value = data.eval_volt;
                
                // 1. 작동기능 지수 - 소계
                document.querySelector('#eval_operate_sum').innerText = data.eval_operate_sum;
                
                
                // 2. 외관점검 지수
                const selectedOption = (data) => {
                    let index;
                    switch(data) {
                        case '없음':
                        case '양호':
                        case '10일이하':
                            index = 0;
                            break;
                        case '있음':
                        case '불량':
                        case '25%':
                        case '11일이상':
                            index = 1;
                            break;
                        case '50%':
                        case '15일이상':
                            index = 2;
                            break;
                        case '100%':
                        case '19일이상':
                            index = 3;
                            break;
                        case '천공_낙하물':
                        case '22일이상':
                            index = 4;
                            break;
                    }
                    return index;
                }
                
                // 2. 외관점검 지수 - 콤보박스
                document.querySelector(`#eval_braidnoise`).selectedIndex = selectedOption(data.eval_braidnoise);
                document.querySelector(`#eval_braidbroken`).selectedIndex = selectedOption(data.eval_braidbroken);
                document.querySelector(`#eval_bearnoise`).selectedIndex = selectedOption(data.eval_bearnoise);
                document.querySelector(`#eval_casing`).selectedIndex = selectedOption(data.eval_casing);
                document.querySelector(`#eval_exterior`).selectedIndex = selectedOption(data.eval_exterior);
                document.querySelector(`#eval_buckle`).selectedIndex = selectedOption(data.eval_buckle);
                document.querySelector(`#eval_eyebolt`).selectedIndex = selectedOption(data.eval_eyebolt);
                document.querySelector(`#eval_bracket`).selectedIndex = selectedOption(data.eval_bracket);
                document.querySelector(`#eval_anchor`).selectedIndex = selectedOption(data.eval_anchor);
                document.querySelector(`#eval_chain`).selectedIndex = selectedOption(data.eval_chain);
                
                // 2. 외관점검 지수 - 콤보박스
                document.querySelector('#eval_braidnoise_score').innerText = data.eval_braidnoise_score;
                document.querySelector('#eval_braidbroken_score').innerText = data.eval_braidbroken_score;
                document.querySelector('#eval_bearnoise_score').innerText = data.eval_bearnoise_score;
                document.querySelector('#eval_casing_score').innerText = data.eval_casing_score;
                document.querySelector('#eval_exterior_score').innerText = data.eval_exterior_score;
                document.querySelector('#eval_buckle_score').innerText = data.eval_buckle_score;
                document.querySelector('#eval_eyebolt_score').innerText = data.eval_eyebolt_score;
                document.querySelector('#eval_bracket_score').innerText = data.eval_bracket_score;
                document.querySelector('#eval_anchor_score').innerText = data.eval_anchor_score;
                document.querySelector('#eval_chain_score').innerText = data.eval_chain_score;
    
                // 2. 외관점검 지수 - 소계
                document.querySelector('#eval_exterior_sum').innerText = data.eval_exterior_sum;


                // 3. 사용연수 지수
                document.querySelector('#eval_useyear').value = data.eval_useyear;
                document.querySelector('#eval_useyear').dataset.durable = data.jetfan_durable; // 제트팬 내구 연수
                document.querySelector('#eval_useyear_score').innerText = data.eval_useyear_score;
                document.querySelector('#eval_useyear_sum').innerText = data.eval_useyear_sum;
                
                // 4. 사용환경 지수
                document.querySelector(`#eval_snow`).selectedIndex = selectedOption(data.eval_snow);
                document.querySelector('#eval_snow_score').innerText = data.eval_snow_score;
                document.querySelector('#eval_env_sum').innerText = data.eval_env_sum;
                
                // 점수합계
                document.querySelector('#eval_score_sum').innerText = data.eval_score_sum;
                document.querySelector('#eval_twenty').innerText = data.eval_twenty;
                document.querySelector('#eval_grade').innerText = data.eval_grade;
            }
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

        document.querySelector('#eval_vibrate').innerText = vibrate;
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
        const eval_braidnoise = document.querySelector('#eval_braidnoise').selectedOptions[0];
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
        const eval_braidbroken = document.querySelector('#eval_braidbroken').selectedOptions[0];
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
        const eval_bearnoise = document.querySelector('#eval_bearnoise').selectedOptions[0];
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
        const eval_casing = document.querySelector('#eval_casing').selectedOptions[0];
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
        const eval_exterior = document.querySelector('#eval_exterior').selectedOptions[0];
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
        const eval_buckle = document.querySelector('#eval_buckle').selectedOptions[0];
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
        const eval_eyebolt = document.querySelector('#eval_eyebolt').selectedOptions[0];
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
        const eval_bracket = document.querySelector('#eval_bracket').selectedOptions[0];
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
        const eval_anchor = document.querySelector('#eval_anchor').selectedOptions[0];
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
        const eval_chain = document.querySelector('#eval_chain').selectedOptions[0];
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
        const eval_snow = document.querySelector('#eval_snow').selectedOptions[0];
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


const inputData = () => {
    const jetfan_no = document.querySelector('#jetfan_no').value;
    const year = document.querySelector('#year').value;
    const year_no = document.querySelector('#eval_update').value;

    // let dataArr = new Array();
    // dataArr.push(jetfan_no);
    // dataArr.push(year);
    // dataArr.push(year_no);


    const data = {
        'jetfan_no': jetfan_no, 
        'year': year , 
        'year_no': year_no,
        'data': [{
            "eval_jetfan_code":"1016",
            "eval_year":"2020",
            "eval_year_no":"1",
            "eval_update":"1",
            "eval_ymd":"2020-11-01",
            "eval_emp":"손정화",
            "eval_company":"프라임방재㈜",
            "eval_vibrate_y_1":"2.1",
            "eval_vibrate_x_1":"2.1",
            "eval_vibrate_z_1":"2.1",
            "eval_vibrate_y_2":"2.1",
            "eval_vibrate_x_2":"2.1",
            "eval_vibrate_z_2":"2.1",
            "eval_vibrate":"2.1",
            "eval_vibrate_score":"1",
            "eval_amp_r":"46",
            "eval_amp_s":"47",
            "eval_amp_t":"48",
            "eval_temp":"25",
            "eval_amp":"47",
            "eval_amp_score":"1",
            "eval_beartemp":"24",
            "eval_beartemp_score":"1",
            "eval_motortemp":"33",
            "eval_motortemp_score":"1",
            "eval_motorinsul":"1.9",
            "eval_motorinsul_score":"1",
            "eval_volt":"380",
            "eval_operate_sum":"5",
            "eval_braidnoise":"없음",
            "eval_braidnoise_score":"1",
            "eval_braidbroken":"없음",
            "eval_braidbroken_score":"1",
            "eval_bearnoise":"없음",
            "eval_bearnoise_score":"1",
            "eval_casing":"0.5",
            "eval_casing_score":"3",
            "eval_exterior":"없음",
            "eval_exterior_score":"1",
            "eval_buckle":"양호",
            "eval_buckle_score":"1",
            "eval_eyebolt":"양호",
            "eval_eyebolt_score":"1",
            "eval_bracket":"양호",
            "eval_bracket_score":"1",
            "eval_anchor":"양호",
            "eval_anchor_score":"1",
            "eval_chain":"양호",
            "eval_chain_score":"1",
            "eval_exterior_sum":"12",
            "eval_useyear":"14",
            "eval_useyear_score":"20",
            "eval_useyear_sum":"20",
            "eval_snow":"15일이상",
            "eval_snow_score":"3",
            "eval_env_sum":"3",
            "eval_score_sum":"40",
            "eval_twenty":"1",
            "eval_grade":"2"
        }]
    };
    console.log('data :>> ', data);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);
            // if(chk_status === 200 && note_status === 200) {
            //     alert('데이터가 정상적으로 입력되었습니다.');

            // } else {
            // }
            
        }
    }

    xhttp.open("PUT", "/evaluation", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}