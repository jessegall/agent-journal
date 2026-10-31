import {createApp} from "vue";
import {tip} from "./kit/tip.js";
import "./tokens.css";
import ViewWindow from "./layout/ViewWindow.vue";
import EnvironmentPage from "./pages/EnvironmentPage.vue";
import AgentPage from "./pages/AgentPage.vue";
import HomePage from "./pages/HomePage.vue";
import WindowShell from "./windows/WindowShell.vue";
import {pageRoute} from "./pageRoute.js";

const PAGES = {environment: EnvironmentPage, view: ViewWindow, agent: AgentPage, shell: WindowShell, home: HomePage};
const {page, props} = pageRoute(location.search);
const app = createApp(PAGES[page], props);
app.directive("tip", tip);
app.mount("#app");
