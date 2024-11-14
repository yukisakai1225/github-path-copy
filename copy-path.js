addFeaturesAttempt();

function addFeaturesAttempt() {
  stopPropagationOfCopyButtons();
  if (!addCopyButtons()) setTimeout(addFeaturesAttempt, 500); // retry after 500 millisecconds
}

function stopPropagationOfCopyButtons() {
  const buttons = document.querySelectorAll(".copy-path-button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });
}

async function addCopyButtons() {
  const buttonHtml = await fetch(chrome.runtime.getURL("button.html")).then(
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
    section.appendChild(b);
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
