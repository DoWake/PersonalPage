function deleteQuote(quote, index) {
  if (index < 0) return;
  const el = document.querySelector(".quote");
  el.innerHTML = quote.slice(0, index);
  setTimeout(function () {
    deleteQuote(quote, --index);
  }, 50);
}

function changeQuote(quote, index) {
  if (index > quote.length) {
    setTimeout(function () {
      deleteQuote(quote, index - 2);
    }, 10000);
    return;
  };
  const el = document.querySelector(".quote");
  el.innerHTML = quote.slice(0, index);
  setTimeout(function () {
    changeQuote(quote, ++index);
  }, 300);
}

function getQuote() {
  const xhr = new XMLHttpRequest;
  xhr.open("GET", "https://v1.hitokoto.cn/");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      const res = JSON.parse(xhr.responseText);
      console.log(res);
      const quote = res.hitokoto + "    ——" + res.from;
      changeQuote(quote, 0);
      setTimeout(getQuote, 350 * quote.length + 11000);
    }
  };
  xhr.send();
}

(function (params) {
  const canvasEl = document.getElementById("bg");
  StarrySky.init(canvasEl);
  StarrySky.render();
  getQuote();
})();