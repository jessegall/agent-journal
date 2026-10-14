// A dead extension (reloaded under an open page) throws on every chrome.* call: asked through this, it answers nothing.
globalThis.journalAsk = (msg, cb) => { try { chrome.runtime.sendMessage(msg, (got) => { void chrome.runtime.lastError; if (cb) cb(got); }); } catch (e) { if (cb) cb(null); } };
