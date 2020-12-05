let opened = false;
fetch("./header.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("header").innerHTML = data;
    document.getElementById("menu-ic").addEventListener('click', () => {
      if(!opened) {
        document.getElementById("mySidenav").style.width = "45%";
        opened = true;
      } else {
        document.getElementById("mySidenav").style.width = "0";    
        opened = false;
      }
    });
  });

fetch("./footer.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("footer").innerHTML = data;
  });



// const sideNav = function() {
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