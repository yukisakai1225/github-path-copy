let currentUrl = location.href;

// SPAだと画面遷移してもcontent scriptが読み込まれないのでURLの変化を監視する
const checkUrlChange = () => {
  if (currentUrl !== location.href) {
    currentUrl = location.href;
    // URLが変わったのでボタンを追加
    addCopyButtons();
  }
};
setInterval(checkUrlChange, 1000); // 1秒ごとにチェック
addCopyButtons();

async function addCopyButtons() {
  const buttonHtml = await fetch(chrome.runtime.getURL("./button.html")).then(
    (response) => response.text()
  );

  const xpath = "//*[@id[contains(., 'review-thread-or-comment-id')]]";
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  for (let i = 0; i < result.snapshotLength; i++) {
    const parentId = result.snapshotItem(i).id;
    const section = document.querySelector(
      `#${parentId} > details > summary > div > span`
    );
    const path = document.querySelector(
      `#${parentId} > details > summary > div > span > a`
    ).textContent;
    const b = createCopyButton(buttonHtml, path);

    if (section.lastChild.tagName !== "BUTTON") {
      section.appendChild(b);
    }
  }
  return true;
}

function createCopyButton(buttonHtml, path) {
  const element = document.createElement("button");
  element.style.all = "unset";
  element.innerHTML = buttonHtml;

  element.children[0].setAttribute("value", path);
  element.children[0].style.marginLeft = "8px";

  return element;
}

function parsePath(path) {
  // ...から始まる場合、...から最初の/まで削除
  if (path.startsWith("...")) {
    return path.substring(path.indexOf("/") + 1);
  }
  return path;
}
