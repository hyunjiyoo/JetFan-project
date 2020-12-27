const getData = () => {

    const jetfan_code = document.querySelector('#jetfan_no').value;
    const data = { 'jetfan_code': jetfan_code };
    console.log('data :>> ', data);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log('data :>> ', data);

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