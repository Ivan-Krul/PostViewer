import * as fileFetcher from "./file_fetcher.js";
import * as PostParser from "./post_parser.js";
import * as themes from "./themes.js";
import * as postBase from "./post_base.js";

const LOCALSTORAGE_DIR = "saved_post_parser_text";
const LOCALSTORAGEAUTOSAVE_DIR = "autosaved_post_parser_text";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

await themes.pinThemeSelector();

function insertStorageArg() {
  var ds = fileFetcher.getURLParams().get("direct_storage");
  var s = fileFetcher.getURLParams().get("storage");
  
  if(ds)     return `?direct_storage=${ds}`;
  else if(s) return `?storage=${s}`;
  return "";
}

async function triggerEffectSave() {
  document.getElementById("buttonSave").style.backgroundColor = "var(--semi)";
  await delay(3000);
  document.getElementById("buttonSave").style.backgroundColor = "var(--main)";
}

async function autosave() {
  localStorage.setItem(LOCALSTORAGEAUTOSAVE_DIR, document.getElementById("input").value);
  await triggerEffectSave();
}

function loadFromAutosave() {
  document.getElementById("input").value = localStorage.getItem(LOCALSTORAGEAUTOSAVE_DIR);
}

function updateRaw(text) {
  let forced = document.getElementById("langArg").value.length ? document.getElementById("langArg").value : undefined;
  let content = "";
  try {
    content = PostParser.parseRawPost(text, forced);
  } catch(e) {
    document.getElementById("source").innerText = e;
  }

  document.getElementById("output").innerHTML = content;
  document.getElementById("title").innerText = PostParser.parseRawTitle(text, forced);
  document.getElementById("source").innerText = content;
  postBase.appendParsedPostToDOM(document.getElementById("output").innerHTML, document.getElementById("output"));
}
function update(event) {
  if(document.getElementById("checkbox_render").checked)
    updateRaw(event.target.value);
}

async function save() {
  localStorage.setItem(LOCALSTORAGE_DIR, document.getElementById("input").value);
  alert("text was saved!");
  await triggerEffectSave();
}

function setAutoRender(e) {
  document.getElementById("button_force_render").disabled = e.target.checked;
}

document.getElementById("buttonSave").onclick = save;

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.which === 83) {
    e.preventDefault();
    save();
  }
});

document.getElementById("checkbox_render").onchange = setAutoRender;
document.getElementById("button_force_render").onclick = () => updateRaw(document.getElementById("input").value);

document.getElementById("input").onkeyup = update;
document.getElementById("buttonLoadAutosave").onclick = loadFromAutosave;

if (localStorage.getItem(LOCALSTORAGE_DIR) === undefined) {
  localStorage.setItem(LOCALSTORAGE_DIR, document.getElementById("input").value);
}
else {
  document.getElementById("input").value = localStorage.getItem(LOCALSTORAGE_DIR);
}

document.getElementById("langArg").onchange = () => {
  updateRaw(document.getElementById("input").value);
}

document.getElementById("back_linker").href = `index.html${insertStorageArg()}`

updateRaw(localStorage.getItem(LOCALSTORAGE_DIR));

setInterval(autosave, 60000);
