"use strict";

var opened = false;
fetch("./header.html").then(function (response) {
  return response.text();
}).then(function (data) {
  document.querySelector("header").innerHTML = data;
  document.getElementById("menu-ic").addEventListener('click', function () {
    if (!opened) {
      document.getElementById("mySidenav").style.width = "45%";
      opened = true;
    } else {
      document.getElementById("mySidenav").style.width = "0";
      opened = false;
    }
  });
});
fetch("./footer.html").then(function (response) {
  return response.text();
}).then(function (data) {
  document.querySelector("footer").innerHTML = data;
}); // const sideNav = function() {
//   let opened = false;
//   document.getElementById("menu-ic").addEventListener('click', (opened) => {
//     if(!opened) {
//       document.getElementById("mySidenav").style.width = "45%";
//       opened = true;
//     } else {
//       document.getElementById("mySidenav").style.width = "0";    
//       opened = false;
//     }
//   });
// }();
// Side navigation
// function openNav() {
//   document.getElementById("mySidenav").style.width = "45%";
// }
// function closeNav() {
//   document.getElementById("mySidenav").style.width = "0";
// }