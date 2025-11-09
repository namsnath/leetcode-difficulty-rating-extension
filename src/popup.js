const checkBoxShowNA = document.getElementById("showNA");
checkBoxShowNA.checked = (await chrome.storage.local.get("showNA")).showNA;
checkBoxShowNA.addEventListener("change", async (e) => {
  await chrome.storage.local.set({showNA: e.target.checked});
});

const clistApiKey = document.getElementById("clist-api-key");
clistApiKey.value = (await chrome.storage.local.get("clistApiKey")).clistApiKey || "";
clistApiKey.addEventListener("change", async (e) => {
  await chrome.storage.local.set({clistApiKey: e.target.value});
});

const clistUsername = document.getElementById("clist-username");
clistUsername.value = (await chrome.storage.local.get("clistUsername")).clistUsername || "";
clistUsername.addEventListener("change", async (e) => {
  await chrome.storage.local.set({clistUsername: e.target.value});
});
