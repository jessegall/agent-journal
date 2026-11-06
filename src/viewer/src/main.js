import {createApp, h} from "vue";
import {tip} from "./kit/tip.js";
import "./tokens.css";
import "./phone/phone.css";
import ServerCover from "./layout/ServerCover.vue";
import ViewWindow from "./layout/ViewWindow.vue";
import EnvironmentPage from "./pages/EnvironmentPage.vue";
import AgentPage from "./pages/AgentPage.vue";
import HomePage from "./pages/HomePage.vue";
import WindowShell from "./windows/WindowShell.vue";
import PairPage from "./pages/PairPage.vue";
import SharePage from "./pages/SharePage.vue";
import {browserCopy} from "./windows/paneLayout.js";
import {readSession} from "./windows/startup.js";
import {shownPage} from "./shownPage.js";
import {followColorScheme, pageTitle} from "./windows/colorScheme.js";
import {pasteByHand} from "./platform/pasteByHand.js";
import {watchPresses} from "./platform/pressed.js";
import "./light.css";

const PAGES = {environment: EnvironmentPage, view: ViewWindow, agent: AgentPage, shell: WindowShell, home: HomePage};
const PAIRING_PATH = "/pair";
const pairingCode = new URLSearchParams(location.hash.slice(1)).get("code") || "";
document.title = pageTitle(shownPage.value.props.environment);
followColorScheme();
pasteByHand();
watchPresses();
const ENDED_LINK_MARK = 'meta[name="journal-share"][content="gone"]';
const start = (answer) => {
    const app = location.pathname === PAIRING_PATH
        ? createApp(PairPage, {code: pairingCode, opened: () => location.assign("/viewer/")})
        : answer.type === "share" || document.querySelector(ENDED_LINK_MARK)
            ? createApp(SharePage, {session: answer.type === "share" ? answer : null})
            : createApp({render: () => h(PAGES[shownPage.value.page], {...shownPage.value.props, key: shownPage.value.page})});
    app.directive("tip", tip);
    app.mount("#app");
    createApp(ServerCover).mount(document.body.appendChild(document.createElement("div")));
};

// the cookie says which face this is: a share link's visitor gets the share page (so does a page the server marks as a gone link), anyone else the viewer;
// a person who opened the viewer in this browser before gets the page at once, so its skeleton shows before the journal has answered, and a new answer reloads it
const SESSION_TYPE_KEY = "journal.session-type";
const PERSON = "person";
const opensAtOnce = browserCopy.read(SESSION_TYPE_KEY) === PERSON && location.pathname !== PAIRING_PATH && !document.querySelector(ENDED_LINK_MARK);
if (opensAtOnce) start({type: PERSON});
readSession().catch(() => ({})).then((answer) => {
    if (answer.type) browserCopy.write(SESSION_TYPE_KEY, answer.type);
    if (!opensAtOnce) start(answer);
    else if (answer.type && answer.type !== PERSON) location.reload();
});
