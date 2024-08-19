// 현재 includes.js 때문에 로딩 순서가 문제이다.
// 1. initSearch 함수를 만들어서 로딩되어야 할 search.js들을 넣어준다.
// 2. DOMContentLoaded -> HTML 문서의 모든 내용이 로드 후 발생하는 이벤트.
// 3. 그래서 DOM 로드 완료 후, includeHTML함수 실행.
//      -> includeHTML함수는 includes.js에 있는 함수이다.
// 4. includeHTML함수에 initSearch함수를 매개변수로 넣어준다.
//      -> includes.js에서 initSearch가 매개변수 callback으로 작동함.
// 이렇게 하면 includes.js가 완전히 실행 된 후 search.js가 실행된다.

const API_KEY = "1fcc678ac940549cb24a61ded5ec9453a2924d7475da7cb94de1d5ad53ee8212";
let searchInput;
const closeButton = document.getElementById("closeButton");
const modal = document.querySelector(".modal");
const modal_overlay = modal.querySelector(".modal_overlay");

function initSearch() {
  searchInput = document.querySelector("#search-input");
  let searchContainer = document.querySelector("#search-container");

  // 검색창 스타일
  searchInput.addEventListener("click", () => {
    searchInput.style.border = "2px solid #fff";
    searchInput.style.boxShadow = "0px 0px 12px rgba(255, 255, 255, 0.2)";
    // searchInput.style.backgroundColor = "#ffffff40";
    searchInput.value = "";
  });
  searchInput.addEventListener("blur", () => {
    searchInput.style.border = "none";
    searchInput.style.boxShadow = "none";
    // searchInput.style.backgroundColor = "#ffffff6c";
    // searchInput.value = "";
  });


  // 모달창 띄우기
  searchContainer.addEventListener("submit", (event) => {
    event.preventDefault(); // 폼 제출 막기
  });
  searchInput.addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
      const foundBookLength = await handleSearch();
      if (foundBookLength === 0) {
        modal.classList.add("hidden");
        alert("검색 결과가 없습니다. 검색어를 다시 입력해 주세요.");
      } else {
        modal.classList.remove("hidden");
      }
    }
  });
  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  document.querySelector(".btn-close").addEventListener("click", () => {
    modal.classList.add("hidden");
  })
  modal_overlay.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
};



// 전역스코프
// let totalResult = 0;
let page = 1; // 1페이지 2페이지 3페이지..
const pageSize = 10; // 1페이지에 게시글 수
const groupSize = 5; // 총 페이지에서 몇 페이지씩 그룹을 묶을건지
let recoList = [];
let totalPages = 1;
let pageGroup = 1;

// modalRender (사서추천 api)
const modalRender = (recoList) => {

  // 시작 인덱스
  const startPage = (page - 1) * pageSize;
  // 끝 인덱스
  const endPage = startPage + pageSize;
  // 현재 페이지
  const currentPageList = recoList.slice(startPage, endPage);
  console.log("startPage", startPage, endPage)
  console.log("currentPageList", currentPageList)


  const modalHTML = currentPageList
    .map(
      (recoItem) =>
        `<article class="modal-item">
            <div class="modal_image">
                <img src="${recoItem.item.recomfilepath["#text"]}" alt="이미지"></img>
            </div>
            <div class="modal_info">
                <h3 class="modal-title">${recoItem.item.recomtitle["#text"]}</h3>
                <p>지은이 : ${recoItem.item.recomauthor["#text"]}</p>
                <p>출판사 : ${recoItem.item.recompublisher["#text"]}</p>
            </div>
        </article>`
    )
    .join("");
  document.getElementById("modal_gird").innerHTML = modalHTML;
};

// modalRender (isbn api)
// const modalRender = () => {
//     const modalHTML = isbnList
//     .map(isbnItem =>
//         `<div class="modal_image">
//             <img src="${isbnItem.TITLE_URL}" alt="이미지"></img>
//         </div>
//         <div class="modal_info">
//             <h3>${isbnItem.SERIES_TITLE ? isbnItem.SERIES_TITLE : isbnItem.TITLE}</h3>
//             <p>${isbnItem.AUTHOR}</p>
//             <p>가격 : ${isbnItem.PRE_PRICE}</p>
//             <p>줄거리 : ${isbnItem.BOOK_INTRODUCTION_URL}</p>
//         </div>`).join('');

//     document.getElementById('modal_gird').innerHTML = modalHTML;
// }

// searchBook (사서추천 api)

const searchBook = async (searchText) => {
  const url = new URL(
    `https://corsproxy.io/?https://nl.go.kr/NL/search/openApi/saseoApi.do?key=${API_KEY}&startRowNumApi=1&endRowNumApi=1325`
  );
  const response = await fetch(url);
  const textData = await response.text();

  // XML을 JSON으로 변환
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(textData, "text/xml");

  // JSON으로 변환
  const jsonResult = xmlToJson(xmlDoc);
  totalPages = parseInt(jsonResult.channel.totalCount["#text"]);
  console.log("totalPages", totalPages);

  recoList = jsonResult.channel.list;
  // console.log("recoList", recoList);

  modalRender(recoList);
  paginationRender();
};

// modalRender (검색 api)
// const modalRender = () => {
//   const modalHTML = searchList
//     .map(
//       (searchItem) =>
//         `<article class="modal-item">
//             <div class="modal_image">
//                 <img src="${"../images/bookskin.png"}" alt="이미지"></img>
//             </div>
//             <div class="modal_info">
//                 <h3 class="modal-title">${searchItem.titleInfo}</h3>
//                 <p>저작자 : ${searchItem.authorInfo}</p>
//                 <p class="modal-descripiton" >
//                  출판사 : ${
//                    // 출판사
//                    searchItem.pubInfo
//                  }
//                  발행년도 :
//                  ${
//                    // 발행년도
//                    searchItem.pubYearInfo
//                  }
//                 </p>
//                 <p>
//                 분류기호 :
//                 ${
//                   // 분류기호
//                   searchItem.kdcCode1s
//                 }
//                 -
//                 ${
//                   // 분류기호
//                   searchItem.kdcName1s
//                 }
//                 </p>
//             </div>
//         </article>
//        `
//     )
//     .join("");
//   document.getElementById("modal_gird").innerHTML = modalHTML;
// };

// 페이지네이션

const paginationRender = (totalItems = recoList.length) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  console.log("pageGroup", pageGroup);
  let lastPage = Math.min(pageGroup * groupSize, totalPages);
  let firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  console.log("firstPage", firstPage, lastPage)


  let paginationHTML = ``;
  // 이전 버튼 추가
  paginationHTML += `<li class="page_item preToPage">
            <a class="page-link" aria-label="Previous">
                <span aria-hidden="true">«</span>
            </a>
        </li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page_item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})">
                <a class="page-link">${i}</a>
            </li>`;
  }


  // 다음 버튼 추가
  if (page < totalPages) {
    paginationHTML += `<li class="page_item nextToPage">
                <a class="page-link" aria-label="Next">
                    <span aria-hidden="true">»</span>
                </a>
            </li>`;
  };

  document.querySelector(".pagination_diy").innerHTML = paginationHTML;
  document.querySelector(".preToPage").addEventListener("click", preToPage);
  // document.querySelector(".nextToPage").addEventListener("click", nextToPage);
  const nextPageElement = document.querySelector(".nextToPage");
  if (nextPageElement) {
    nextPageElement.addEventListener("click", nextToPage);
  }

};

const handleSearch = async () => {

  page = 1;
  const currentSearchText = searchInput.value;
  console.log("currentSearchText", currentSearchText)
  await searchBook(currentSearchText);
  const foundBook = recoList.filter(searchText =>
    searchText.item.recomauthor["#text"].includes(currentSearchText) ||
    searchText.item.recomtitle["#text"].includes(currentSearchText) ||
    searchText.item.recompublisher["#text"].includes(currentSearchText)
  );
  console.log("foundBook", foundBook);
  searchResult = foundBook;
  modalRender(searchResult);
  const totalItems = searchResult.length;
  paginationRender(totalItems);
  return totalItems;
};

const moveToPage = async (pageNum) => {
  console.log("moveToPage", pageNum);
  page = pageNum;
  modalRender(searchResult);
  paginationRender(searchResult.length);
};

const preToPage = async () => {
  if (page > 1) {
    page--;
    modalRender(searchResult);
    paginationRender(searchResult.length);
  }
};

const nextToPage = async () => {
  if (page < totalPages) {
    page++;
    modalRender(searchResult);
    paginationRender(searchResult.length);
  }
}
const setActivePage = (pageNum) => {
  const pageItems = document.querySelectorAll(".page_item");
  pageItems.forEach((pageItem, index) => {
    if (pageItem.classList.contains("preToPage") || pageItem.classList.contains("nextToPage")) {
      return;
    }
    pageItem.classList.remove("active");
    if ((index + 1) === pageNum) {
      pageItem.classList.add("active");
    }
  });

};

paginationRender();

// XML을 JSON으로 변환하는 함수
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
document.addEventListener("DOMContentLoaded", function () {
  includeHTML(initSearch);
});
// searchBook (isbn api)
// let isbnList = [];
// const isbn = async () => {
//     const url = new URL(`https://www.nl.go.kr/seoji/SearchApi.do?cert_key=${API_KEY}&result_style=json&page_no=${page}&page_size=${pageSize}`)
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log("data", data);
//     isbnList = data.docs;
//     // totalResult = data.TOTAL_COUNT;
//     console.log("isbn", isbnList);

//     const bookTitle = "성인행동치료 사례집";
//     const foundBook = isbnList.find(book => book.TITLE === bookTitle);
//     console.log("foundBook",foundBook);

//     modalRender();
//     paginationRender();
// }
// isbn(searchInput.value);

// searchBook (검색 api)
// const searchBook = async (searchText) => {
//   // 한글 인코딩을 위한 함수 -> encodeURIComponent
//   const encodedText = encodeURIComponent(searchText);
//   console.log("searchText", encodedText);
//   const url = new URL(
//     `https://www.nl.go.kr/NL/search/openApi/search.do?key=${API_KEY}&apiType=json&category=%EB%8F%84%EC%84%9C&srchTarget=title&kwd=${encodedText}&pageNum=${page}&pageSize=${pageSize}`
//   );
//   const response = await fetch(url);
//   const data = await response.json();
//   console.log("data", data);
//   searchList = data.result;
//   totalResult = data.total;
//   console.log("search", searchList);
//   console.log("total", totalResult);
//   modalRender();
//   paginationRender();
// };
// searchBook(searchInput.value);
