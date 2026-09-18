// ONE BUTTON. Everything else — which journal, which environment, pointing, pictures — is done
// from inside the chat window, which the journal draws; the popup only opens it.
document.getElementById("chat").addEventListener("click", () => {
  chrome.runtime.sendMessage({ kind: "chat" }, (got) => {
    if (got && got.ok) return window.close();
    document.getElementById("said").textContent = (got && got.why) || "This page cannot hold the chat window.";
  });
});
