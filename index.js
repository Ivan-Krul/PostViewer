import * as fileFetcher from "./file_fetcher.js";
import * as postParser from "./post_parser.js";
import * as postBase from "./post_base.js";
import * as themes from "./themes.js";

function insertStorageArg() {
  var ds = fileFetcher.getURLParams().get("direct_storage");
  var s = fileFetcher.getURLParams().get("storage");
  
  if(ds)     return `direct_storage=${ds}`;
  else if(s) return `storage=${s}`;
  return "";
}

function insertArguments(post) {
  let s = insertStorageArg();
  if(post) {
    if(s)
      return `?post=${post}&${s}`;
    else
      return `?post=${post}`;
  }
  else
    if(s)
      return `?${s}`;
    else
      return ``;
}

async function loadMultiplePosts(postArg) {
  let content = "";
  let contentLinks = [];
  
  try {
    contentLinks = (await fileFetcher.fetchFile(`${fileFetcher.getContentLink()}/partitions.txt`)).replaceAll('\r', '').split('\n');
  } catch (e) {
    document.getElementById("content").innerHTML = e;
    return;
  }
  
  document.getElementById("content").innerHTML = `<a href="${insertArguments()}">Back to Browser</a>`;
  
  for(let i = contentLinks.length - 1; i >= Math.max(0, contentLinks.length - postArg); i--) {
    try {
      content = await fileFetcher.fetchFile(`${fileFetcher.getContentLink()}/posts/${contentLinks[i]}`);
      var title = postParser.parseRawTitle(content);
  
      var dateArr = contentLinks[i].split("_");
      var date = `${dateArr[2]}. ${dateArr[1].substring(dateArr[1].indexOf(')') + 1)}. ${dateArr[0]}`;
      document.getElementById("content").innerHTML += `<hr/><h1>${title} (${date})</h1>${postParser.parseRawPost(content)}`;
    } catch (e) {
      document.getElementById("content").innerHTML += e;  
    }
  }

  postBase.appendParsedPostToDOM(document.getElementById("content").innerHTML);
}

async function loadSinglePost(postArg) {
  let content = "";
  
  try {
    content = await fileFetcher.fetchFile(`${fileFetcher.getContentLink()}/posts/${postArg}`);
  } catch (e) {
    document.getElementById("content").innerHTML = e;  
    return;
  }
  
  let title = postParser.parseRawTitle(content);
  
  let dateArr = postArg.split("_");
  
  let date = `${dateArr[2].substr(0, 2)}. ${dateArr[1].substr(dateArr[1].indexOf(')') + 1)}. ${dateArr[0]}`;
  
  document.getElementById("content").innerHTML = postParser.parseRawPost(content);
  document.getElementById("title").innerHTML = `Post Viewer - ${title} (${date})`;
  
  postBase.appendParsedPostToDOM(document.getElementById("content").innerHTML);
}

async function loadBrowserList() {
  let content = "";
  let contentLinks = [];
  
  try {
    contentLinks = (await fileFetcher.fetchFile(`${fileFetcher.getContentLink()}/partitions.txt`)).replaceAll('\r', '').split('\n');
  } catch (e) {
    document.getElementById("content").innerHTML = e;
    return;
  }
  
  for(let i = contentLinks.length -1; i >= 0; i--) {
    const link = contentLinks[i];
    
    document.getElementById("content").innerHTML += `<div class="post_link"><a href="${insertArguments(link)}">${link}</a></div>`;
  }
  
  document.getElementById("content").innerHTML += "<div style=\"clear: left;\">";
  
}


async function main() {
  await themes.pinThemeSelector();
  
  let postArg = fileFetcher.getURLParams().get("post");
  
  document.getElementById("back_linker").href = `index.html${insertArguments()}`;
  document.getElementById("constructor_linker").href = `constructor.html${insertArguments()}`;
  
  if(postArg == null)
    await loadBrowserList();
  else if(postArg.lastIndexOf(".") !== -1)
    await loadSinglePost(postArg);
  else
    await loadMultiplePosts(postArg);
  
}

await main();
