import {createApp} from "vue";
import {tip} from "../kit/tip.js";
import ShareApp from "./ShareApp.vue";
import "../tokens.css";
import "../light.css";
import "./share.css";

createApp(ShareApp).directive("tip", tip).mount("#app");
