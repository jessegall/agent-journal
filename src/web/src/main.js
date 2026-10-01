import {createApp} from "vue";
import App from "./App.vue";
import {watchConsole} from "./faults.js";
import "./tokens.css";

watchConsole();

const start = () => createApp(App).mount("#app");

if (__DEMO__) import("../demo/boot.js").then(({install}) => install().then(start));
else start();
