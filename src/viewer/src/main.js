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
const ENDED_LINK_MARK = 'meta[name="journal-share"][content="gone"]';
const start = (answer) => {
    const app = location.pathname === PAIRING_PATH
        ? createApp(PairPage, {code: pairingCode, opened: () => location.assign("/viewer/")})
        : answer.type === "share" || document.querySelector(ENDED_LINK_MARK)
            ? createApp(SharePage, {session: answer.type === "share" ? answer : null})
            : createApp(PAGES[page], props);
    app.directive("tip", tip);
    app.mount("#app");
};

// the cookie says which face this is: a share link's visitor gets the share page (so does a page the server marks as a gone link), anyone else the viewer
readSession().catch(() => ({})).then(start);
