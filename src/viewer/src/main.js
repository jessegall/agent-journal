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
import {readSession} from "./windows/startup.js";
import {pageRoute} from "./pageRoute.js";

const PAGES = {environment: EnvironmentPage, view: ViewWindow, agent: AgentPage, shell: WindowShell, home: HomePage};
const PAIRING_PATH = "/pair";
const pairingCode = new URLSearchParams(location.hash.slice(1)).get("code") || "";
const {page, props} = pageRoute(location.search);
const start = (answer) => {
    const app = location.pathname === PAIRING_PATH
        ? createApp(PairPage, {code: pairingCode, opened: () => location.assign("/viewer/")})
        : answer.type === "share"
            ? createApp(SharePage, {session: answer})
            : createApp(PAGES[page], props);
    app.directive("tip", tip);
    app.mount("#app");
};

// the cookie says which face this is: a share link's visitor gets the share page, anyone else the viewer
readSession().catch(() => ({})).then(start);
