const API_KEY = `bbaa351bbf88c6e2f61f5d9f2e71fbdf67c4e01b279c7fe537b1c97a2417e585`;

let url = new URL(`https://www.nl.go.kr/NL/search/openApi/search.do?key=${API_KEY}&detailSearch=true&isbnOp=isbn&isbnCode=8984993727`);

let targetBookDetail = async () => {
    url = new URL(`https://www.nl.go.kr/NL/search/openApi/search.do?key=${API_KEY}&detailSearch=true&isbnOp=isbn&isbnCode=8984993727`);
    const response = await fetch(url);
    const text = await response.text();
    // Now you need to parse the XML text into a JavaScript object using a library like xml-js or xml2js
    // For example, using xml-js:
    const { xml2json } = require('xml-js');
    const jsonData = xml2json(text, { compact: true, spaces: 4 });
    console.log("Parsed XML data:", jsonData);
};

targetBookDetail();
