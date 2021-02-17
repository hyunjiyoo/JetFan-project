let opened = false;
const nav_menu = function() {
  if(!opened) {
    document.getElementById("mySidenav").style.width = "45%";
    opened = true;
  } else {
    document.getElementById("mySidenav").style.width = "0";    
    opened = false;
  }
};


const auto_grow = (element) => {
  element.style.height = '';
  element.style.height = (element.scrollHeight)+"px";
}


const displaySupervisor = (permission) => {
  
  const disabledInputBtn = () => {
    Swal.fire({
      title: '안내사항', 
      text: '데이터 조회만 가능합니다',
      icon: 'info',
      confirmButtonText: '확인',
      onAfterClose: () => window.scrollTo(0,0)
    });
  }

  if(permission) {
    if(document.querySelector('#inputBtn')) {
      inputBtn.addEventListener('click', disabledInputBtn);
    }
  
    if(document.querySelector('#submitBtn')) {
      submitBtn.addEventListener('click', disabledInputBtn);
    }
  
    const inputs = document.querySelectorAll('input');
    if(inputs.length) {
      inputs.forEach((input, i) => {
          if(i > 0) {
              input.disabled = true;
          }
      });
    }
    
    const selects = document.querySelectorAll('select');
    if(selects.length) {
      selects.forEach((select, i) => {
          if(i > 6) {
              select.disabled = true;
          }
      });
    }
  
    const textareas = document.querySelectorAll('textarea');
    if(textareas.length) {
      textareas.forEach((textarea, i) => {
        textarea.disabled = true;
      });
    }
  
    return true;

  } else {

    return false;
  
  }
}


// document.querySelector('#basic').addEventListener('click', function() {
//   const permission = 0;
//   if(permission) {
//     Swal.fire({
//       title: '안내사항', 
//       text: '접근권한이 없습니다.',
//       icon: 'info',
//       confirmButtonText: '확인',
//       onAfterClose: () => window.scrollTo(0,0)
//     });
//     return false;
  // }
  
  // const xhttp = new XMLHttpRequest();
  // xhttp.onreadystatechange = function() {
  //   console.log('ready state change', this.readyState, this)
  //   if (this.readyState === 4 && this.status === 200) {
  //     console.log('this.response :>> ', this.response);
  //     // window.location.href = this.response;

  //     // // alert('hello');
  //     // let el = document.getElementsByTagName('html')
  //     // // console.log("html element", el);
  //     window.document.body.innerHTML = this.response;

  //     // window.location.pathname = '/basic';
  //     // location.href = './basic';
  //     // console.log('response text', this.response);
  //     // // console.log("html element", el);
  //   }
  // }

  // xhttp.open("GET", "/basic", true);
  // xhttp.setRequestHeader('Content-Type', 'application/json');
  // xhttp.setRequestHeader('Authorization', window.localStorage.getItem('access_token'));
  // xhttp.send('');
// });