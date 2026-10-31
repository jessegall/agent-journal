import {createApp} from "vue";
import {tip} from "./kit/tip.js";
import "./tokens.css";
import ViewWindow from "./layout/ViewWindow.vue";
import WindowShell from "./windows/WindowShell.vue";

const query = new URLSearchParams(location.search);
const environment = query.get("environment") || "main";
const layout = query.get("windows") ? query.get("windows").split(",") : null;
const app = query.get("view")
    ? createApp(ViewWindow, {environment, view: query.get("view"), float: Number(query.get("float")) || 0})
    : createApp(WindowShell, {environment, layout});
app.directive("tip", tip);
app.mount("#app");
