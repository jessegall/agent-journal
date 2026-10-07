import {createApp} from "vue";
import App from "./App.vue";
import {watchConsole} from "./platform/faults.js";
import {tip} from "./kit/tip.js";
import "./tokens.css";

watchConsole();

function start({root = App, given = new Map()} = {}) {
    const app = createApp(root);
    app.directive("tip", tip);
    given.forEach((value, key) => app.provide(key, value));
    app.mount("#app");
}

if (__DEMO__) import("../demo/boot.js").then(({install}) => install().then(start));
else start();
