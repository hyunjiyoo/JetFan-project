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


const disabledInputBtn = () => {
  Swal.fire({
    title: '안내사항', 
    text: '데이터 조회만 가능합니다',
    icon: 'info',
    confirmButtonText: '확인',
    onAfterClose: () => window.scrollTo(0,0)
  });

}

const displaySupervisor = (permission) => {

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


document.querySelector('#menu-ic').addEventListener('click', () => {
  if(sessionStorage.length & location.pathname != '/login') {
    nav_menu();

  } else {
      Swal.fire({
          title: '사전점검', 
          text: '로그인을 먼저 해주세요.',
          icon: 'info',
          confirmButtonText: '확인',
          onAfterClose: () => window.scrollTo(0,0)
      }).then(() => {
          window.sessionStorage.clear();
          location.href = './login';
      });
  }
});