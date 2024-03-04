// // [참고] https://www.w3schools.com/howto/howto_html_include.asp

// function includeHTML(callback = function () {}) {
//   let z, i, elmnt, file, xhr;
//   z = document.getElementsByTagName("*");
//   for (i = 0; i < z.length; i++) {
//     elmnt = z[i];
//     file = elmnt.getAttribute("include-html");
//     if (file) {
//       xhr = new XMLHttpRequest();
//       xhr.onreadystatechange = function () {
//         if (this.readyState == 4) {
//           if (this.status == 200) {
//             elmnt.innerHTML = this.responseText;
//           }
//           if (this.status == 404) {
//             elmnt.innerHTML = "Page not found.";
//           }
//           elmnt.removeAttribute("include-html");
//           includeHTML(callback);
//         }
//       };
//       xhr.open("GET", file, true);
//       xhr.send();
//       return;
//     }
//   }
//   setTimeout(function () {
//     callback();
//   }, 0);
// }

// console.log(22);
function includeHTML(callback) {
  callback = callback || function () {}; // callback이 undefined일 경우, 빈 함수를 할당
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          elmnt.removeAttribute("include-html");
          includeHTML(callback); // 콜백 함수를 인자로 전달
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  setTimeout(() => callback(), 0);
}
