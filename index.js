import * as fileFetcher from "./file_fetcher.js";

async function setTheme() {
  let root = document.documentElement;
  let themeArg = fileFetcher.getURLParams().get("theme").toLowerCase();
  
  let themesJson = await fileFetcher.fetchJson("./themes.json");
  
  for(let i = 0; i < themesJson.length; i++) {
    if(themesJson[i].name.includes(themeArg)) {
      root.style.setProperty('--main', themesJson[i].main);
      root.style.setProperty('--semi', themesJson[i].semi);
      root.style.setProperty('--text', themesJson[i].text);
    }
  } 
  
}

async function loadSinglePost(postArg) {
  let title = "";
  let content = "";
  
  try {
    content = await fileFetcher.fetchFile(`https://raw.githubusercontent.com/Ivan-Krul/PostStorage/main/posts/${postArg}`);
  } catch (e) {
    content = e;
  }
  
  document.getElementById("content").innerHTML = content;
  document.getElementById("title").innerHTML = title;
}

async function main() {
  await setTheme();
  
  let postArg = fileFetcher.getURLParams().get("post");
  
  if(postArg != null)
    await loadSinglePost(postArg);
  
  
}

await main();
