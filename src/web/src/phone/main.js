import {createApp} from "vue";
import PhoneApp from "./PhoneApp.vue";
import "../tokens.css";
import "../light.css";
import "./phone.css";

const start = (root = PhoneApp) => createApp(root).mount("#app");

if (__DEMO__) import("../../demo/phoneBoot.js").then(({install}) => install().then(start));
else start();
