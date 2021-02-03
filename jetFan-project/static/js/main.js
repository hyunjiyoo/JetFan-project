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

function auto_grow(element) {
  element.style.height = (element.scrollHeight)+"px";
}