import * as fileFetcher from "./file_fetcher.js";
import * as temp from "./temp.js";

function replaceAllOccurrences(inputString, substringToReplace, replacementValue) {
  var escapedSubstring = substringToReplace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var regex = new RegExp(escapedSubstring, 'g');
  var resultString = inputString.replace(regex, replacementValue);

  return resultString;
}

export const begLangTag = `#->[]#`;
export const endLangTag = `#<-[]#`;

function getLangTag(str = "", forcedLang = undefined) {
  var lang = undefined;

  if(forcedLang)
    lang = forcedLang;
  else
    lang = fileFetcher.getURLParams().get("lang");

  if (lang === null) {
    lang = "en";
  }

  let indxBeg = str.indexOf(begLangTag.replace("[]", lang));
  let indxEnd = str.indexOf(endLangTag.replace("[]", lang));

  if (indxBeg === -1) return str;
  if (indxEnd === -1) throw `Bracket for language ${lang} wasn't closed`;

  return str.substring(indxBeg + begLangTag.length, indxEnd);
}

export const titleOpen = "T=>";
export const titleClose = "<=T";

export const dictionary =
  [
    [titleOpen, "<!--"],
    [titleClose, "-->"],

    ["/*", "<!--"],
    ["*/", "-->"],

    ["\\<", "&lt;"],
    ["\\>", "&gt;"],

    ["!!!! ", "<h1>"],
    [" !!!!", "</h1>"],

    ["ilcr- ", `<img src="${fileFetcher.getDomainLink()}/CharacterRegister/image/`],
    [" -ilcr", "\">"],

    ["il- ", `<img src="${fileFetcher.getContentLink()}/image/`],
    [" -il", "\">"],

    ["i- ", "<img src=\""],
    [" -i", "\">"],

    ["\\\"", "\\\""],

    ["\"->", "<div>"],
    ["<-\"", "</div>"],
    
    ["\"{", "<div id=\""],
    ["} ", "\">"],
    ["}*", "}"],

    ["\" ", "<div>"],
    [" \"", "</div>"],


    ["[ ", "<i>["],
    [" ]", "]</i>"],

    ["\"*", "\""],
    ["*\"", "\""],

    ["<!github ", "<a target=\"_blank\" href=\"https://github.com/"],
    ["<!twitter ", "<a target=\"_blank\" href=\"https://twitter.com/"],
    ["<!youtube ", "<a target=\"_blank\" href=\"https://www.youtube.com/"],
    [" !>", "</a>"],

    ["<<cr ", `<a target=\"_blank\" href="../CharacterRegister/`],
    [" cr>>", "</a>"],

    ["<<l ", `<a target=\"_blank\" href="../`],
    [" l>>", "</a>"],

    ["<< ", "<a target=\"_blank\" href=\""],
    [">|<", "\">"],
    [" >>", "</a>"],

    [" ##| ", "<span style=\"background-color: var(--main); color:var(--main)\">"],
    [" <| ", "</span>"],

    [" -- ", "<li>"],
    [" |-- ", "</li>"],

    [">-> ", "<dir>"],
    [" >->", "</dir>"],

    [">q> ", "<blockquote style=\"color: var(--semi);\">"],
    [" >q>", "</blockquote>"],

    ["|S- ", "<style>"],
    [" -S|", "</style>"],

    ["|$- ", `<script type=\"module\" src=\"`],
    [" -$|", "\"></script>"],

    ["|$ ", `<script type=\"module\">import * as fileFetcher from "./file_fetcher.js";`],
    [" $|", "</script>"],

    ["!|", "<br/>"]
  ];

export var ignoreList = [];

export const ignoreParsingOpen = "##>";
export const ignoreParsingClose = "<##";

function cropIgnored(str = "") {
  ignoreList = [];
  
  let indxOp = str.indexOf(ignoreParsingOpen, 0);
  let indxCl = str.indexOf(ignoreParsingClose, 0);
  
  let cleanStr = "";
  if(indxOp === -1)
    cleanStr = str;
  else
    cleanStr = str.substr(0, indxOp + ignoreParsingOpen.length);
  
  let breakpointInd = 0;
  
  while(indxOp !== -1 && breakpointInd < 100) {
    breakpointInd++;
    if(indxCl === -1) {
      ignoreList.push(str.substr(indxOp + ignoreParsingOpen.length));
      break;
    }
    else
      ignoreList.push(str.substr(indxOp + ignoreParsingOpen.length, indxCl - (indxOp + ignoreParsingOpen.length)));
    
    indxOp = str.indexOf(ignoreParsingOpen, indxCl + ignoreParsingClose.length);
    
    if(indxOp === -1) {
      cleanStr += str.substr(indxOp + ignoreParsingClose.length);
    }
    else
      cleanStr += str.substr(indxCl + ignoreParsingClose.length, indxOp + ignoreParsingOpen.length);
    
    indxCl = str.indexOf(ignoreParsingClose, indxOp + ignoreParsingOpen.length);
  }
  
  return cleanStr;
}

function revertIgnored(cleanStr = "") {
  let indxOp = cleanStr.indexOf(ignoreParsingOpen, 0);
  let addIndxOp = cleanStr.indexOf(ignoreParsingOpen, indxOp + ignoreParsingOpen.length);
  
  let str = "";
  if(indxOp === -1)
    str = cleanStr;
  else
    str = cleanStr.substr(0, indxOp);
  
  let i = 0;
  let breakpointInd = 0;
  
  while(indxOp !== -1 && breakpointInd < 100) {
    breakpointInd++;
    str += ignoreList[i];
    i++;
    
    if(addIndxOp === -1) {
      str += cleanStr.substr(indxOp + ignoreParsingOpen.length);
      break;
    }
    else {
      str += cleanStr.substr(indxOp + ignoreParsingOpen.length, addIndxOp - (indxOp + ignoreParsingOpen.length));
      indxOp = addIndxOp;
      addIndxOp = cleanStr.indexOf(ignoreParsingOpen, indxOp + ignoreParsingOpen.length);
    }
  }
  
  return str;
}

function adaptRawString(str = "", forcedLang = undefined) {
  let strCom = str.replaceAll("\r", "");
  let langCom = getLangTag(strCom, forcedLang);
  return cropIgnored(langCom);
}

export function parseRawTitle(str = "", forcedLang = undefined) {
  let res = adaptRawString(str,forcedLang);

  if(res.indexOf(titleOpen) !== -1 && res.indexOf(titleClose) !== -1) {
    return res.substring(res.indexOf(titleOpen) + titleOpen.length, res.indexOf(titleClose));
  }

  return "undefined";
}

export function parseRawPost(str = "", forcedLang = undefined) {
  let res = adaptRawString(str, forcedLang);

  dictionary.forEach((regex_value) => {
    res = replaceAllOccurrences(res, regex_value[0], regex_value[1]);
  });
  
  //console.log(ignoreList);
 
  return revertIgnored(res);
}

export function appendParsedPostToDOM(parsedContent) {
  document.getElementById("temp").innerHTML = "";

  const scriptRegexSrc = /<script type="module" src="([^"]+)"><\/script>/g;
  let match;
  while ((match = scriptRegexSrc.exec(parsedContent)) !== null) {
    const script = document.createElement("script");
    script.type = "module";
    script.src = match[1];
    document.getElementById("temp").appendChild(script);
  }

  const scriptRegexInline = /<script type="module">(.*?)<\/script>/gs;
  while ((match = scriptRegexInline.exec(parsedContent)) !== null) {
    const scriptContent = match[1];
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = scriptContent;
    document.getElementById("temp").appendChild(script);
  }
}
