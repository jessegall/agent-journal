import {createApp} from "vue";
import {followColorScheme} from "../composables/colorScheme.js";
import {tip} from "../kit/tip.js";
import PhoneApp from "./PhoneApp.vue";
import "../tokens.css";
import "../light.css";
import "./phone.css";

const start = (root = PhoneApp) => {
    followColorScheme();
    createApp(root).directive("tip", tip).mount("#app");
};

if (__DEMO__) import("../../demo/phoneBoot.js").then(({install}) => install().then(start));
else start();
