// let englishTextToTranslate = "I like you very much.";

let translatedJapaneseText;

let jishoResponse;

function search(ele) {
  if (event.key === "Enter") {
    translateText(ele.value);
  }
}

async function translateText(englishTextToTranslate) {
  // if (!e.key === "Enter") {
  // 	return;
  // }
  // let englishTextToTranslate = e.value;

  await fetch(
    `https://api-free.deepl.com/v2/translate?auth_key=b0731268-6ffd-6f0b-e0ad-f4f9a3a475e0:fx&text=${englishTextToTranslate}&target_lang=JA`,
    { method: "POST" }
  )
    .then((response) => response.json())
    .then((r) => (translatedJapaneseText = r.translations[0].text))
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  // 	console.log(
  // 		`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
  // 			translatedJapaneseText
  // 		)}`
  // 	);

  // 	await fetch(
  // 		`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
  // 			translatedJapaneseText
  // 		)}`
  // 	)
  // 		.then((response) => response.json())
  // 		.then((result) => console.log(result))
  // 		.catch((error) => console.log("error", error));

  console.log(`https://jisho.org/search/${translatedJapaneseText}`);

  fetch(`https://jisho.org/search/${translatedJapaneseText}`)
    .then((response) => response.text())
    .then((html) => {
      jishoResponse = parseJisho(html);
    });
}

async function parseJisho(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  console.log(doc);
  let r = doc.querySelector("#zen_bar");
  console.log(r);
  if (r != null) {
    document.body.appendChild(r);
    // document.body.appendChild(doc.querySelector("#primary > div.exact_block"));

    // get word definition for each word
    console.log(document.querySelectorAll("[data-word]"));
    for (let node of document.querySelectorAll("[data-word]")) {
      // console.log(node);
      // console.log(node.innerHTML);
      console.log(`https://jisho.org/search/${node.innerText}`);
      await fetch(`https://jisho.org/search/${node.innerText}`)
        .then((response) => response.text())
        .then((html) => {
          parseJishoInternal(html);
        });
    }
  } else {
    r = doc.querySelector("#primary > div.exact_block > div");
    document.body.appendChild(r);
  }
}

function parseJishoInternal(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  // console.log(doc);

  let r = doc.querySelector("#primary > div.exact_block > div");
  if (r != null) {
    document.body.appendChild(r);
  }
}

// translateText();
