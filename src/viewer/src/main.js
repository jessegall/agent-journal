import {createApp} from "vue";
import {tip} from "./kit/tip.js";
import "./tokens.css";
import "./phone/phone.css";
import ViewWindow from "./layout/ViewWindow.vue";
import EnvironmentPage from "./pages/EnvironmentPage.vue";
import AgentPage from "./pages/AgentPage.vue";
import HomePage from "./pages/HomePage.vue";
import WindowShell from "./windows/WindowShell.vue";
import PairPage from "./pages/PairPage.vue";
import SharePage from "./pages/SharePage.vue";
import {pageRoute} from "./pageRoute.js";

const PAGES = {environment: EnvironmentPage, view: ViewWindow, agent: AgentPage, shell: WindowShell, home: HomePage};
const PAIRING_PATH = "/pair";
const SHARE_PATH = "/viewer/share/";
const pairingCode = new URLSearchParams(location.hash.slice(1)).get("code") || "";
const {page, props} = pageRoute(location.search);
const app = location.pathname === PAIRING_PATH
    ? createApp(PairPage, {code: pairingCode, opened: () => location.assign("/viewer/")})
    : location.pathname.startsWith(SHARE_PATH)
        ? createApp(SharePage)
        : createApp(PAGES[page], props);
app.directive("tip", tip);
app.mount("#app");
