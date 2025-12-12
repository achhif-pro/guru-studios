// 以下若遇到問題或是想添加可以發信給RAN詢問
// ----------------第一組------------------------------------------------------------------
//  ----- 以下可以於該處先行使用JQ帶入變數
let $team_slider = $(".slider__class1");
//  ----- 以下為設定輪播樣式
let team_slider_settings = {
  //---- 簡易設定介紹
  //---- slidesToShow**重要**為一次秀出幾個項目
  //---- slidesToScroll為按左右按鈕或者自動輪播時一次要跳轉幾個項目

  //---- dots的trueFalse為是否開啟小點跳轉
  //---- arrows的trueFalse為是否開啟左右箭頭點選
  //---- prevArrow及nextArrow 為自訂義左右按鈕，要搭配可任意在該DIV做自訂義修改(classOrHtml都可)

  //---- autoplay與autoplaySpeed為自動輪播開啟及開啟後每幾秒跳轉一次
  //---- speed為類似transtion的功能 素質越大轉移當按鈕時越慢
  //---- swipe的trueFalse為關閉電腦端按住拖動 touchMove的trueFalse為關閉手機端按住拖動
  dots: false,
  arrows: true,
  // autoplay: true,
  // autoplaySpeed: 3000,
  slidesToShow: 5,
  slidesToScroll: 5,
  swipe: true,
  touchMove: true,
  prevArrow: `<div class="slider__class1-prev setbg"></div>`,
  nextArrow: `<div class="slider__class1-next setbg"></div>`,
  speed: 400,
  // 以下為RWD設定 RWD可完全覆蓋上個斷點的設定 若不想更改的屬性會自動延用
  responsive: [
    //以下設定為在底下breakpoint以前**關閉**輪播效果
    // {
    //     breakpoint: 99999,
    //     settings: "unslick"
    // },
    {
      // 此為斷點類似css的@media 設定斷點後該段點以下為SLIDER的樣式
      breakpoint: 1300,
      settings: {
        // 要覆蓋原先設定的屬性就寫SETTINGS裡面
        dots: false,
        arrows: true,
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      // 此為斷點類似css的@media 設定斷點後該段點以下為SLIDER的樣式
      breakpoint: 575,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      // 此為斷點類似css的@media 設定斷點後該段點以下為SLIDER的樣式
      breakpoint: 475,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
// 以下為開啟函式

$team_slider.slick(team_slider_settings);

// ----------------第一組結束----------------------------------------------------------------
