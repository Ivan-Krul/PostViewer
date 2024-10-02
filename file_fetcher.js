export async function fetchFile(filePath) {
  return fetch(filePath)
    .then(response => response.text())
    .catch(error => {
      console.error('*Error fetching ' + filePath + ':', error);
      throw '*Error fetching ' + filePath + ':', error;
    });
}

export async function fetchJson(filePath) {
  return fetch(filePath)
    .then(response => response.json())
    .catch(error => {
      console.error('*Error fetching ' + filePath + ':', error);
      throw '*Error fetching ' + filePath + ':', error;
    });
}

let r = false;
try {
  const result = await fetch("ignore/debug_key", { method: "HEAD" });
  r = result.ok ? true : false;
} catch (e) {
  r = false;
}

export function getContentLink() {
  return r ? "../PostStorage" : "https://raw.githubusercontent.com/Ivan-Krul/PostStorage/main";
}

export function getDomainLink() {
  return "..";
}

export function getURLParams() {
  return new URLSearchParams(window.location.search);
}
