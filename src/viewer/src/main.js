import {createApp} from "vue";
import {tip} from "./kit/tip.js";
import "./tokens.css";
import ViewWindow from "./layout/ViewWindow.vue";
import AgentPage from "./pages/AgentPage.vue";
import HomePage from "./pages/HomePage.vue";
import WindowShell from "./windows/WindowShell.vue";

const query = new URLSearchParams(location.search);
const environment = query.get("environment") || "main";
const layout = query.get("windows") ? query.get("windows").split(",") : null;
const app = query.get("view")
    ? createApp(ViewWindow, {environment, view: query.get("view"), float: Number(query.get("float")) || 0})
    : query.get("agent")
      ? createApp(AgentPage, {environment, agent: Number(query.get("agent"))})
      : layout
        ? createApp(WindowShell, {environment, layout})
        : createApp(HomePage, {environment});
app.directive("tip", tip);
app.mount("#app");
