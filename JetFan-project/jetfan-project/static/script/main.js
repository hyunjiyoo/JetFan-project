let opened = false;
const sideNav = function() {
    document.getElementById("menu-ic").addEventListener('click', () => {
        if(!opened) {
          document.getElementById("mySidenav").style.width = "45%";
          opened = true;
        } else {
          document.getElementById("mySidenav").style.width = "0";    
          opened = false;
        }
      });
}();