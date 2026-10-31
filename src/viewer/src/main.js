import {createApp} from "vue";
import {tip} from "./kit/tip.js";
import "./tokens.css";
import WindowShell from "./windows/WindowShell.vue";

const query = new URLSearchParams(location.search);
const layout = query.get("windows") ? query.get("windows").split(",") : null;
const app = createApp(WindowShell, {environment: query.get("environment") || "main", layout});
app.directive("tip", tip);
app.mount("#app");
