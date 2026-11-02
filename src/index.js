// let englishTextToTranslate = "I like you very much.";

let translatedJapaneseText;

let jishoResponse;

// Register the handler from the bundled script instead of relying on a
// global inline HTML handler (which module bundlers do not expose).
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("textToTranslate");
  if (!input) return;
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") translateText(input.value);
  });
});

async function translateText(englishTextToTranslate) {
  // if (!e.key === "Enter") {
  // 	return;
  // }
  // let englishTextToTranslate = e.value;

  // A server endpoint must authenticate and rate-limit callers, and keep
  // DEEPL_AUTH_KEY on the server. No DeepL credentials belong in browser code.
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: englishTextToTranslate, target_lang: "JA" })
    });
    if (!response.ok) {
      throw new Error("Translation proxy returned " + response.status);
    }
    const result = await response.json();
    if (!result || typeof result.translation !== "string" || !result.translation) {
      throw new Error("Translation proxy did not return a translation");
    }
    translatedJapaneseText = result.translation;
  } catch (error) {
    console.error("Translation unavailable", error);
    window.alert("Translation is unavailable until a secure backend is configured.");
    return;
  }

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
