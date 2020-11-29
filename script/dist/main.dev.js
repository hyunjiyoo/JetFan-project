"use strict";

fetch("./header.html").then(function (response) {
  return response.text();
}).then(function (data) {
  document.querySelector("header").innerHTML = data;
});
fetch("./footer.html").then(function (response) {
  return response.text();
}).then(function (data) {
  document.querySelector("footer").innerHTML = data;
});