import {createApp} from "vue";
import App from "./App.vue";
import {watchConsole} from "./platform/faults.js";
import "./tokens.css";

watchConsole();

const start = (root = App) => createApp(root).mount("#app");

if (__DEMO__) import("../demo/boot.js").then(({install}) => install().then(start));
else start();
