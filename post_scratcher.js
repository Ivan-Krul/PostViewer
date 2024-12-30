import * as fileFetcher from "./file_fetcher.js";
import * as temp from "./temp.js";

/*
V=> scratcher <=V
-- title --
~>
text in div
~&>
html code
~I>
./image/symbol of currency S.png
~JS>
js code
~CSS>
also css

~>
enter


~>
double enter

~&=
  <div id="abc">
  ~I>
  ./image/symbol of currency S.png
  ~>
  man doin this stuff is insane
  =
  </div>
=>

*/

export const VERSION_IMPORT = "scratcher";

export const DICTIONARY = {
  "TITLE_OPEN": "-- ",
  "TITLE_CLOS": " --",

  "ROCKET_FLAME": "~",
  "ROCKET_TIP"  : ">",
  "ROCKET_BODY" : "=",
  "ROCKET_HTML" : "&",
  "ROCKET_CSS"  : "CSS",
  "ROCKET_JS"   : "JS"
};

export const EMPTY_LOAD_UNWRAP = "div";

export function parseRawTitle(str = "") {
  
}

export function parseRawPost(str = "") {
  var splits = str.replaceAll('\r', '').split('\n');
  
  
}


