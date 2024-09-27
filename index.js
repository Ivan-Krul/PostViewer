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

async function main() {
  await setTheme();
  
}

await main();
