import "../main.js";
import "./phone.css";

// The phone app is the viewer itself in a phone's shell; its service worker serves all of /p/.
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js", {scope: "./"}).catch(() => {});
