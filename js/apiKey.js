// const API_KEY = '1fcc678ac940549cb24a61ded5ec9453a2924d7475da7cb94de1d5ad53ee8212'

// let isbnList = [];
// const isbn = async () => {
//     const url = new URL(`https://www.nl.go.kr/seoji/SearchApi.do?cert_key=${API_KEY}&result_style=json&page_no=${page}&page_size=10`)
//     const response = await fetch(url);
//     const data = await response.json();
//     isbnList = data.docs;
//     totalResult = data.TOTAL_COUNT;
//     console.log("isbn", isbnList)
//     modalRender()
// }
// isbn()

// let recoList = [];
// const recommend = async () => {
//     const url = new URL(`https://corsproxy.io/?https://nl.go.kr/NL/search/openApi/saseoApi.do?key=${API_KEY}`);
//     const response = await fetch(url);
//     const textData = await response.text();

//     // XML을 JSON으로 변환
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(textData, "text/xml");

//     // JSON으로 변환
//     const jsonResult = xmlToJson(xmlDoc);
//     recoList = jsonResult.channel.list
//     console.log("reco", recoList);

//     modalRender()
// }
// recommend();

// // XML을 JSON으로 변환하는 함수
// function xmlToJson(xml) {
//   // Create the return object
//   var obj = {};

//   if (xml.nodeType == 1) { // element node
//       // do attributes
//       if (xml.attributes.length > 0) {
//           obj["@attributes"] = {};
//           for (var j = 0; j < xml.attributes.length; j++) {
//               var attribute = xml.attributes.item(j);
//               obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
//           }
//       }
//   } else if (xml.nodeType == 3) { // text node
//       obj = xml.nodeValue;
//   }

//   // do children
//   if (xml.hasChildNodes()) {
//       for (var i = 0; i < xml.childNodes.length; i++) {
//           var item = xml.childNodes.item(i);
//           var nodeName = item.nodeName;
//           if (typeof obj[nodeName] == "undefined") {
//               obj[nodeName] = xmlToJson(item);
//           } else {
//               if (typeof obj[nodeName].push == "undefined") {
//                   var old = obj[nodeName];
//                   obj[nodeName] = [];
//                   obj[nodeName].push(old);
//               }
//               obj[nodeName].push(xmlToJson(item));
//           }
//       }
//   }
//   return obj;
// }
