import {createApp} from "vue";
import App from "./App.vue";
import {tip} from "./kit/tip.js";
import "./tokens.css";
import {watchPresses} from "./platform/pressed.js";
import {followPage} from "./state/updating.js";
import {logInputs} from "./platform/inputLog.js";
import {pasteByHand} from "./platform/pasteByHand.js";

watchPresses();
// the input log is for hunting a lost paste: on only when the browser's storage says so (journal.inputLog = on)
if (localStorage.getItem("journal.inputLog") === "on") logInputs(window);
pasteByHand(window);
followPage(document);

function start({root = App, given = new Map()} = {}) {
    const app = createApp(root);
    app.directive("tip", tip);
    given.forEach((value, key) => app.provide(key, value));
    app.mount("#app");
}

start();
