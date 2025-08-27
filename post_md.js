import * as fileFetcher from "./file_fetcher.js";
import * as temp from "./temp.js";
import* as postBase from "./post_base.js";

export const VERSION_IMPORT = "md";

export function parseRawTitle(str = "") {
  var firsthash = str.indexOf('#');
  if(firsthash === -1) return "undefined";

  var nl = str.indexOf('\n', firsthash);
  if(nl === -1) return "undefined";
  
  var lasthash = str.lastIndexOf('#', nl);
  if(lasthash === -1) return "undefined";
  
  return str.substring(lasthash + 1, nl);
}

function cookHashTag(line) {
  let counthash = 1;
  for(var h = 1; h < line.length; h++) {
    if(line[h] === '#') counthash++;
    if(line[h] === '~') {
      stat += '~';
      return {type: "html"};
    }
    if(line[h] !== '#') break;
  }
  
  var res_line = line.substring(counthash + 1, line.length);
  
  return {res: `<h${counthash}>${res_line}</h${counthash}>`};
}

function prepareLinkingTag(line) {
  let clb = line.indexOf(']');
  let opb = line.indexOf('[');
  let clr = line.lastIndexOf(')');
  if(opb === -1) return {};
  if(clb === -1) return {};
  if(clr === -1) return {};
  
  let res_text = line.substring(opb + 1, clb);
  let res_link = line.substring(clb + 2, clr);
  
  return {text: res_text, link: res_link};
}

function cookLinkTag(line) {
  let tag = prepareLinkingTag(line);
  if(tag == {}) return {};
  return {res: `<a target="_blank" href="${tag.link}">${tag.text}</a>`};
}

function cookImgTag(line) {
  let tag = prepareLinkingTag(line);
  if(tag == {}) return {};
  return {res: `<img src="${tag.link}" alt="${tag.text}">`};
}

function flushMultiline(text_buf, type) {
  if(type === "html")
    return `${text_buf}`;
  return `<div>${text_buf}</div>`;
}

export function parseRawPost(str = "") {
  var res_str = "";
  var lis = str.replaceAll('\r', '');
  var text_buf = "";
  var type = "";
  
  var list = lis.split('\n');
  
  for(let i = 1; i < list.length; i++) {
    const line = list[i];
    var tag = {};
    
    if(line.length < 1) {
      res_str += flushMultiline(text_buf, type);
      text_buf = "";
    }
    if(line[0] === '#') {
      tag = cookHashTag(line);
    }
    else if(line[0] === '!') {
      tag = cookImgTag(line);
    }
    else if(line[0] === '[') {
      tag = cookLinkTag(line);
    }    
    else {
      text_buf += line + ' ';
    }
    
    if(tag.type != undefined) {
      type = tag.type;
    }
    if(tag.res != undefined) {
      res_str += tag.res;
    }
    
  }
  
  if(text_buf.length > 1) {
    res_str += flushMultiline(text_buf, type);
  }
  
  return res_str;
}


