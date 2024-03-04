includeHTML(function () {
  const API_KEYdong = `ddad4259b659af428252ec826266babcb91d3bedc9d03f0dc7c703a28c0100b3`;
  let booklistAll = [];
  let todyBookList = [];
  let pageSize = 6;
  let pageNo = 1;
  let TpageNo = 1;
  let pageTotalCount = 0;
  let url = ``;
  let Turl = ``;
  let bookList = document.querySelector(".booklist");
  let booklistBts = document.querySelectorAll(".booklist-bt");
  let booklistSlider = document.querySelector(".booklist-slider");
  let booklistToday = document.querySelector(".booklist-today");
  let TpageSize = 6;
  let TpageTotalCount = 0;
  // xml

  // getAPI
  const getAPI = async () => {
    try {
      url.searchParams.set("page_size", pageSize);
      url.searchParams.set("page_no", pageNo);
      const response = await fetch(url);
      const data = await response.json();
      if (response.status == 200) {
        booklistAll = data.docs;
        pageTotalCount = data.TOTAL_COUNT;
        rander();
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const getURL = async () => {
    url = new URL(
      `https://www.nl.go.kr/seoji/SearchApi.do?cert_key=${API_KEYdong}&result_style=json`
    );
    getAPI();
  };
  getURL();

  // 사서추천 API
  const recommend = async () => {
    const url = new URL(
      `https://corsproxy.io/?https://nl.go.kr/NL/search/openApi/saseoApi.do?key=${API_KEYdong}&startRowNumApi=1&endRowNumApi=30`
    );
    // url.searchParams.set("endRowNumApi", TpageSize);
    // url.searchParams.set("startRowNumApi", TpageTotalCount);
    const Tresponse = await fetch(url);
    const textData = await Tresponse.text();

    // XML을 JSON으로 변환
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(textData, "text/xml");

    // JSON으로 변환
    const jsonResult = xmlToJson(xmlDoc);
    todyBookList = jsonResult.channel.list;
    // console.log("todyBookList", todyBookList);
    TpageTotalCount = parseInt(jsonResult.channel.totalCount["#text"]);

    Trander();
  };
  recommend();
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

  // render
  const rander = () => {
    let bookListAllHTML = ``;
    bookListAllHTML = booklistAll
      .map(
        (i) => `
    <li class="booklist-item">
        <div class="booklist-img-box">
            <img class="booklist-img" src="${
              i.TITLE_URL || "../images/bookskin.png"
            }" alt="책 표지" />
            
            <span class="booklist-sub-title">${
              i.TITLE_URL == "" ? i.TITLE : ""
            }</span>
            <span class="booklist-sub-author"> ${
              i.TITLE_URL == "" ? i.AUTHOR : ""
            }</span>
        </div>
        <h3 class="booklist-title">${i.TITLE}</h3>
        <span class="booklist-author">${i.AUTHOR} 지음</span>
    </li>
  `
      )
      .join("");

    booklistSlider.innerHTML = bookListAllHTML;
  };
  // 사서 추천 render
  const Trander = () => {
    let TbookListAllHTML = ``;
    TbookListAllHTML = todyBookList
      .map(
        (i) =>
          `
          <li class="booklist-item">
              <div class="booklist-img-box">
                  <img class="booklist-img" src="${
                    i.item.recomfilepath["#text"] || "../images/bookskin.png"
                  }" alt="책 표지" />
                  
                  <span class="booklist-sub-title">${
                    i.item.mokchFilePath["#text"] == ""
                      ? i.item.recomtitle[".text"]
                      : ""
                  }</span>
                  <span class="booklist-sub-author"> ${
                    i.item.mokchFilePath["#text"] == ""
                      ? i.item.recomauthor["#text"]
                      : ""
                  }</span>
              </div>
              <h3 class="booklist-title">${i.item.recomtitle["#text"]}</h3>
              <span class="booklist-author">${
                i.item.recomauthor["#text"]
              } 지음</span>
          </li>
        `
      )
      .join("");

    booklistToday.innerHTML = TbookListAllHTML;
  };

  // 버튼 클릭시 북리스트 다음페이지로 넘김
  let slideNum = 170 + 77;
  const booklistSliderAll = document.querySelector(".booklist-sliderAll");
  const booklistSliderToday = document.querySelector(".booklist-sliderToday");
  let moverSlide = 0;
  let TmoverSlide = 0;

  booklistBts.forEach((e) => {
    e.addEventListener("click", () => {
      if (e.id == "left" && pageSize > 6) {
        pageSize -= 1;
        getAPI();
        booklistSliderAll.style.transform = `translateX(${(moverSlide +=
          slideNum)}px)`;
      } else if (e.id == "right" && pageSize < pageTotalCount) {
        pageSize += 1;
        getAPI();
        booklistSliderAll.style.transform = `translateX(${(moverSlide -=
          slideNum)}px)`;
      }

      // T
      if (e.id == "tleft" && TpageSize > 6) {
        TpageSize -= 1;
        // TpageNo -= 1;
        recommend();
        booklistSliderToday.style.transform = `translateX(${(TmoverSlide +=
          slideNum)}px)`;
      } else if (e.id == "tright" && TpageSize <= 30) {
        TpageSize += 1;
        // TpageNo += 1;
        recommend();
        booklistSliderToday.style.transform = `translateX(${(TmoverSlide -=
          slideNum)}px)`;
      }
    });
  });
  //

  let quote = document.querySelector(".quote-randomizer-phrase");
  let quoteBt = document.querySelector(".quote-bt");
  let quotID = 0;

  const getSay = async () => {
    let Sdata, randomeSay, randomeSayID;

    do {
      const Surl = new URL(`https://api.adviceslip.com/advice`);
      let Sresponse = await fetch(Surl);
      Sdata = await Sresponse.json();
      randomeSay = Sdata.slip["advice"];
      randomeSayID = Sdata.slip["id"];
    } while (randomeSayID === quotID);

    quotID = randomeSayID;
    quote.textContent = randomeSay;
  };

  getSay();
  quoteBt.addEventListener("click", () => {
    quote.textContent = "오늘의 명언 찾는중.......";
    getSay();
  });

  // 처음으로 돌아가기 버튼
  let booklistFirst = document.querySelectorAll(".booklist-first");
  booklistFirst.forEach((e) => {
    e.addEventListener("click", () => {
      if (e.id == "all-booklist") {
        booklistSliderAll.style.transform = "translateX(0)";
        pageSize = 6;
        moverSlide = 0;
      } else if (e.id == "td-booklist") {
        booklistSliderToday.style.transform = "translateX(0)";
        TmoverSlide = 0;
        TpageSize = 6;
      }
    });
  });
});
