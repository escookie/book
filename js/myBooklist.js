// 사전정보

// ISBN
// https://www.nl.go.kr/seoji/SearchApi.do?cert_key=[발급된키값]&result_style=json&page_no=1&page_size=10

// 사서 추천도서
// https://nl.go.kr/NL/search/openApi/saseoApi.do?key=[발급된 인증키]


const myAPI =
    "7a328df4e2e5bc6c3dd52d51251e3469a5d0910058d86c71204180d55a9afce2";
let ISBNUrl = new URL(
    `https://www.nl.go.kr/seoji/SearchApi.do?cert_key=${myAPI}&result_style=json&page_no=1&page_size=1`
);
let RecommendUrl = new URL(
    `https://corsproxy.io/?https://nl.go.kr/NL/search/openApi/saseoApi.do?key=${myAPI}&endRowNemApi=100&start_date=20220101`
);
let bookList = [];
let matchArray = [];
let matchBookList = [];
let ISBNList = []

// let ISBNList = [
//     {
//         isbn: "9791185035154",
//         url: "https://www.nl.go.kr/afile/previewThumbnail/NLR-1267",
//     },
//     {
//         isbn: "9788961961844",
//         url: "https://www.nl.go.kr/afile/previewThumbnail/NLR-1259",
//     },
//     {
//         isbn: "9791167373618",
//         url: "https://www.nl.go.kr/afile/previewThumbnail/24013052262qnXFI",
//     },
//     {
//         isbn: "9788983717054",
//         url: "https://www.nl.go.kr/afile/previewThumbnail/NLR-1278",
//     },
//     {
//         isbn: "9788996586043",
//         url: "https://www.nl.go.kr/afile/previewThumbnail/NLR-1056",
//     },
// ];

// let ISBNList = ["9791185035154", "9788961961844", "9791167373618", '9788983717054', '9788996586043']

// const recommend = async () => {
//     const response = await fetch(RecommendUrl)
//     const responseData = await response.text()

//     const parser = new DOMParser()
//     const XMLData = parser.parseFromString(responseData, "text/xml")

//     const jsonData = xmlToJson(XMLData);

//     console.log("jsonData: ", jsonData)
//     console.log("사서추천도서: ", jsonData.channel.list)

//     bookList = jsonData.channel.list.filter(book => ISBNList.includes(book.item.recomisbn['#text']));

//     console.log("booklist: ", bookList);

//     // bookList = jsonData.channel.list
//     // console.log("booklist: ", bookList)

//     // matchBookList = bookList.filter(book => ISBNList.includes(book.item.recomisbn['#text']));
//     // console.log("matchList: ", matchBookList);

//     render()
// }


// xml json으로 변환 함수
function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) {
        // element node
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        // text node
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof obj[nodeName] == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof obj[nodeName].push == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

// 이미지 url도 넘겨받을때
// const render = () => {
//     const bookHTML = matchBookList.map((book) => {
//         // ISBNList에서 해당 도서의 ISBN에 해당하는 URL을 찾습니다.
//         const isbnItem = ISBNList.find(item => item.isbn === book.EA_ISBN);
//         // ISBN에 해당하는 URL이 존재한다면 이미지 소스로 설정합니다.
//         const imageURL = isbnItem ? isbnItem.url : '';

//         return `
//         <div class="book">
//             <div class="book_firstDiv">
//                 <input type="checkbox" onclick = "toggle('${book.EA_ISBN})">
//                 <input type="checkbox" id="read">
//             </div>
//             <div class="book_midDiv">
//                 <img src="${imageURL}" alt="책 이미지 위치">
//                 <div class="bookInfo">
//                     <div id="title">${book.TITLE}</div>
//                     <div id="codeName">${book.AUTHOR}</div>
//                 </div>
//             </div>
//             <div class="book_lastDiv">
//                 <button onclick = "deleteBook('${book.EA_ISBN}')">
//                     <img src="../images/trash.svg">
//                 </button>
//             </div>
//         </div>
//         `
//     }).join("")
//     document.querySelector(".booksArea").innerHTML = bookHTML
// }

// isbn만 넘겨 받을 때 (객체 형태 { })
const render = () => {
    if (matchArray.length == 0) {
        document.querySelector("#loading_text").innerHTML = "찜한 책이 없어요!"
        document.querySelector(".booklist_explain").style.display = "none";
        return
    }
    document.querySelector(".booklist_explain").style.display = "flex";
    const bookHTML = matchBookList
        .map((book) => {
            // ISBNList에서 해당 도서의 ISBN에 해당하는 URL을 찾습니다.
            const isbnItem = ISBNList.find((item) => item.isbn === book.EA_ISBN);
            // ISBN에 해당하는 URL이 존재한다면 이미지 소스로 설정합니다.
            const imageURL = isbnItem ? isbnItem.url : "";

            return `
        <div class="book">
            <div class="book_container" id = "book_${book.EA_ISBN}">
                <div class="book_firstDiv">
                    <input type="checkbox" id="pur_${book.EA_ISBN}" onclick = "purchased('${book.EA_ISBN}')">
                    <input type="checkbox" id="read_${book.EA_ISBN}" onclick = "read('${book.EA_ISBN}')">
                </div>
                <div class="book_midDiv">
                <div id="noBookImg">
                    <img src="${book.TITLE_URL || '../images/bookskin.png'}" alt="책 이미지 위치">
                    <div id="noImg_info">
                        <div class="bookimg_title">${book.TITLE_URL == "" ? book.TITLE : ""}</div>
                        <div class="bookimg_author"> ${book.TITLE_URL == "" ? book.AUTHOR : ""}</div>
                    </div>
                </div>
                <div class="bookInfo" id="bookInfo_${book.EA_ISBN}">
                    <div onclick="popWindow(${book.EA_ISBN})" id="title">${book.TITLE}</div>
                    <div id="author">${book.AUTHOR}</div>
                    <div id="purchased_${book.EA_ISBN}" class="purchased_defult">구매 완료 <img src="../images/payments.svg"></div>
                </div>
                </div>
                <div class="book_lastDiv">
                    <button onclick = "deleteBook('${book.EA_ISBN}')">
                        <img src="../images/trash.svg">
                    </button>
                </div>
            </div>
        </div>
        `;
        })
        .join("");
    document.querySelector(".booksArea").innerHTML = bookHTML;
};

async function matchISBN() {
    if (!Array.isArray(ISBNList)) {
        console.error("ISBNList is not an array");
        return;
    }

    for (let i of ISBNList) {
        ISBNUrl.searchParams.set("isbn", i.isbn);
        console.log("ISBNUrl.href: ", ISBNUrl.href);
        const response = await fetch(ISBNUrl.href);
        const matchData = await response.json();

        matchArray.push(matchData);

        console.log("매칭된 데이터: ", matchData);
    }
    console.log("matchArray: ", matchArray);

    matchBookList = matchArray.flatMap((item) => item.docs || []);

    console.log("matchBookList: ", matchBookList);

    render();
}


// 구매완료 효과
function purchased(isbnNum) {
    const bookInfo_title = document.querySelector(`#bookInfo_${isbnNum} #title`)
    const bookInfo_author = document.querySelector(`#bookInfo_${isbnNum} #author`)
    const checkbox = document.getElementById(`pur_${isbnNum}`);
    const purchased_ment = document.getElementById(`purchased_${isbnNum}`);
    bookInfo_title.classList.toggle("purchased", checkbox.checked)
    bookInfo_author.classList.toggle("purchased", checkbox.checked)
    purchased_ment.classList.toggle("purchased_ment", checkbox.checked)
}

// 다읽음 효과
function read(isbnNum) {
    const book = document.querySelector(`#book_${isbnNum}`)
    const checkbox = document.getElementById(`read_${isbnNum}`);

    book.classList.toggle("read", checkbox.checked)
}

// 리스트 삭제
function deleteBook(isbn) {
    // matchBookList에서 해당 도서의 인덱스를 찾습니다.
    const index = matchBookList.findIndex(book => book.EA_ISBN === isbn);
    if (index !== -1) {
        // 해당 도서를 배열에서 제거합니다.
        matchBookList.splice(index, 1);
        // 변경된 matchBookList로 UI를 다시 렌더링합니다.
        render();

        // localStorage에서 저장된 데이터 불러오기
        let storedData = localStorage.getItem('wishData');
        if (storedData) {
            // 저장된 데이터를 객체 배열로 변환
            let allData = JSON.parse(storedData);
            console.log("삭제 예정 데이터셋: ", allData)

            // 해당 ISBN 코드와 일치하는 객체를 찾아서 제거
            let updatedData = allData.filter(book => book.isbn !== isbn);
            console.log("updatedData", updatedData)

            if (updatedData.length == 0) {
                const nobookHTML = `
                <div class="booksArea">
                    <div id="loading_text">찜한 책이 없어요!</div>
                </div>
                `
                document.querySelector(".booksArea").innerHTML = nobookHTML
            }

            // 새로운 데이터를 localStorage에 저장
            localStorage.setItem('wishData', JSON.stringify(updatedData));

            console.log(`Book with ISBN ${isbn} deleted successfully from localStorage.`);
        } else {
            console.log("No data found in localStorage.");
        }
    }
}

// let ISBN = book.EA_ISBN

function popWindow(ISBN) {
    let params = `
          scrollbars=yes,
          resizable=yes,
          status=no,
          location=no,
          toolbar=no,
          menubar=yes,
          width=1000,
          height=800,
          left=(window.screen.width / 2) - (width/2),
          top=(window.screen.height / 4)
          `;
    // Append the ISBN to the URL as a query parameter
    let detailPageURL = `detail_page.html?isbn=${encodeURIComponent(ISBN)}`;
    window.open(detailPageURL, "a", params);
    console.log("Sent to child window", ISBN)
}


// This event handler will listen for messages from the child
window.addEventListener("message", (e) => {
    //e.data hold the message from the child
    // Check if the received message is the expected object
    if (e.data && e.data.isbn && e.data.wishCondition) {
        console.log("Received from child window:", e.data)
    }
})

// 로컬 스토리지에서 데이터 읽어오기
let storedData = localStorage.getItem('wishData');
if (storedData) {
    let allData = JSON.parse(storedData);

    // 데이터를 JSON 문자열로 출력
    console.log("Received data:", allData);

    ISBNList = allData
} else {
    console.log("No data received.");
}

matchISBN();
