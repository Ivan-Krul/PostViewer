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

export function getURLParams() {
  return new URLSearchParams(window.location.search);
}
