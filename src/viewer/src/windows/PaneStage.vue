<script setup>
import {computed, onMounted, onUnmounted, ref, watch, watchEffect} from "vue";
import LayoutPicker from "../agents/LayoutPicker.vue";
import {useLayoutPresets} from "./layoutPresets.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import {useTabCounts} from "../composables/tabCounts.js";
import {usePaneActions} from "../composables/paneActions.js";
import DetachedWindows from "../layout/DetachedWindows.vue";
import DragGhost from "../panes/DragGhost.vue";
import DropCompass from "../panes/DropCompass.vue";
import PaneGrid from "../panes/PaneGrid.vue";
import SplitOffer from "../panes/SplitOffer.vue";
import PaneTour from "../panes/PaneTour.vue";
import {usePaneGuide} from "../composables/paneGuide.js";
import {followFullscreen} from "../platform/fullscreen.js";
import {store as shell} from "../state/store.js";
import {leaves} from "../domain/panes.js";
import PaneMenuOptions from "../panes/PaneMenuOptions.vue";
import PaneTabs from "../panes/PaneTabs.vue";
import WindowPane from "./WindowPane.vue";
import PhoneBar from "./PhoneBar.vue";
import PhoneNotify from "./PhoneNotify.vue";
import AgentBar from "../shell/AgentBar.vue";
import InformationBar from "../shell/InformationBar.vue";
import WindowDropdown from "./WindowDropdown.vue";
import ResourcePanel from "../resource/ResourcePanel.vue";
import {streamAlive} from "./windowCatalogue.js";
import UpdateBand from "../shell/UpdateBand.vue";
import {peekRef} from "../route.js";
import {rememberedRef} from "./rememberedState.js";
import {NO_FACTS} from "../domain/barFacts.js";
import AwayCard from "../shell/AwayCard.vue";
import Breadcrumb from "../shell/Breadcrumb.vue";
import Skeleton from "../kit/Skeleton.vue";
import QuickMenu from "../shell/QuickMenu.vue";
import {colorScheme, nextColorScheme, pageTitle, SCHEMES} from "./colorScheme.js";
import {shellKeyAction} from "./shellKeys.js";
import SidebarPages from "../shell/SidebarPages.vue";
import ActivityPanel from "../shell/ActivityPanel.vue";

const props = defineProps({
    store: {type: Object, required: true},
    catalogue: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    page: {type: String, default: "home"},
    floats: {type: Boolean, default: true},
    prompts: {type: Object, default: null},
    shellRead: {type: Function, default: null},
    face: {type: String, default: "person"},
});

const presets = props.shellRead ? useLayoutPresets({environment: props.environment, page: props.page, shellLine: props.shellRead, catalogue: props.catalogue, store: props.store}) : null;
const isAgentWindow = (name) => props.catalogue.window(name)?.place === "agent";
// an agent window follows the page's main agent unless its pane was set to another
const agentOf = (name, pane = null) => (isAgentWindow(name) ? (pane?.options?.agent ?? props.agent) : null);
const followable = computed(() => usage.value.agents.filter((row) => row.id !== props.agent && !row.ended_at));
const PHONE_WIDTH = 700;
const CHAT_WINDOW = "messages.chat";
const grid = ref(null);
const narrow = ref(window.innerWidth < PHONE_WIDTH);
const width = ref(window.innerWidth);
const measure = () => {
    narrow.value = window.innerWidth < PHONE_WIDTH;
    width.value = window.innerWidth;
};
const FILES_WINDOW = "coding.files";
const MENU_PARTS = ".pane-menu,.pane-add,.pane-add-button,.pane-menu-button,.pane-tour";
const adding = ref(null);
const agentRow = ref(null);
const agentKnown = ref(false);
// the rows a list read gave, none when it failed or answered something else
const rowsOf = (answer) => (answer?.ok && Array.isArray(answer.value?.rows) ? answer.value.rows : []);
const environments = ref([]);
const events = ref([]);
const activityOpen = rememberedRef("activity-open", false);
const wideKept = rememberedRef("full-screen", false);
shell.wide = wideKept.value;
watch(() => shell.wide, (wide) => (wideKept.value = wide));
const SIDEBAR_FROM_WIDTH = 1100;
const ACTIVITY_SECONDS = 4;
const sideHidden = rememberedRef("shell.side-hidden", false);
const sideMini = rememberedRef("shell.side-mini", false);
// the sidebar button goes from the whole sidebar to its icons, then to none, then back
function stepSidebar() {
    if (sideHidden.value) [sideHidden.value, sideMini.value] = [false, false];
    else if (sideMini.value) sideHidden.value = true;
    else sideMini.value = true;
}
const sidebarShown = computed(() => Boolean(props.shellRead) && !phone.value && width.value >= SIDEBAR_FROM_WIDTH && !sideHidden.value);
const project = computed(() => environments.value?.find?.((row) => row.name === props.environment)?.folder?.split("/").pop() || "agent-journal");
watchEffect(() => (document.title = pageTitle(props.environment, project.value)));
let activityTimer = null;
let factsTimer = null;
const FACT_SECONDS = 5;
async function readActivity() {
    const answer = activityOpen.value && props.shellRead ? await props.shellRead(["event", "list", "--limit", "30"]) : null;
    if (answer?.ok) events.value = rowsOf(answer);
}
function toggleActivity() {
    activityOpen.value = !activityOpen.value;
    readActivity();
}
async function readEnvironments() {
    const answer = props.shellRead ? await props.shellRead(["environment", "list"]) : null;
    environments.value = rowsOf(answer);
}
const facts = ref(NO_FACTS);
const now = ref(Date.now());
const currentTask = computed(() => (facts.value.task_id ? {id: facts.value.task_id, title: facts.value.task_title} : null));
// the window that lists what each count in the bars counts
const COUNT_WINDOWS = {jobs: "schedules.jobs", tasks: "tasks.tasks", waiting: "questions.questions", helpers: "agents.subagents", agents: "agents.agents", workers: "workers.workers", reviewers: "reviews.reviewers", usage: "usage.usage", context: "usage.context", fitness: "usage.fitness"};
const usage = ref({agents: [], windows: []});
const fitness = ref(null);
async function readUsage() {
    const answer = props.shellRead ? await props.shellRead(["usage", "show"]) : null;
    if (!answer?.ok) return;
    usage.value = answer.value;
    agentRow.value = answer.value.agents.find((row) => row.role === "main") ?? null;
    if (agentRow.value) {
        const measured = await props.shellRead(["usage", "fitness", "--agent", String(agentRow.value.id)]);
        fitness.value = measured?.ok ? measured.value : null;
    }
    agentKnown.value = true;
}
// a page opens at its own address and a window in a pane
const pageAddress = (name) => `?environment=${encodeURIComponent(props.environment)}&page=${encodeURIComponent(name)}`;
const goTo = (name) => (props.catalogue.window(name)?.place === "page" ? location.assign(pageAddress(name)) : openView(name));
const openDropdown = ref(null);
const openCount = (key) => {
    const name = COUNT_WINDOWS[key];
    if (props.catalogue.dropdown(name)) openDropdown.value = openDropdown.value === name ? null : name;
    else if (props.catalogue.window(name)) openView(name);
};
const pairedPhones = ref([]);
async function readPhones() {
    const answer = await props.shellRead(["phone", "list"]);
    if (answer.ok) pairedPhones.value = answer.value.rows.filter((row) => row.state === "paired");
}
async function readFacts() {
    if (!props.shellRead) return;
    readUsage();
    readPhones();
    const answer = await props.shellRead(["usage", "bars"]);
    now.value = Date.now();
    if (answer.ok) facts.value = answer.value;
}
const chatFirst = (pane) => (pane.pane.tabs.includes(CHAT_WINDOW) ? 0 : 1);
const phone = computed(() => props.face === "phone");
const phoneNames = computed(() => {
    const layout = props.store.layout.value;
    const names = layout ? leaves(layout.tree).flatMap((id) => layout.panes[id].tabs) : [];
    return [...names.filter((name) => name === CHAT_WINDOW), ...names.filter((name) => name !== CHAT_WINDOW)];
});
const phoneWindows = computed(() => phoneNames.value.map((name) => props.catalogue.window(name) || {name, title: name, icon: "window"}));
const chosen = ref(null);
const picked = computed(() => (phoneNames.value.includes(chosen.value) ? chosen.value : phoneNames.value[0]));
// a row's reference, such as questions:4, names the window that lists its kind, questions.questions
const windowOfRef = (ref) => `${ref.split(":")[0]}.${ref.split(":")[0]}`;
const linkedRef = () => new URLSearchParams(location.hash.slice(1)).get("open");
function openRef(ref) {
    if (phone.value) chosen.value = windowOfRef(ref);
    else peekRef(ref);
}
const heardWorker = (event) => event.data?.open && openRef(event.data.open);
onMounted(() => {
    window.addEventListener("resize", measure);
    navigator.serviceWorker?.addEventListener("message", heardWorker);
    presets?.load();
    readEnvironments();
    readFacts();
    factsTimer = setInterval(readFacts, FACT_SECONDS * 1000);
    activityTimer = setInterval(readActivity, ACTIVITY_SECONDS * 1000);
    if (linkedRef()) openRef(linkedRef());
});
onUnmounted(() => {
    clearInterval(activityTimer);
    clearInterval(factsTimer);
    window.removeEventListener("resize", measure);
    navigator.serviceWorker?.removeEventListener("message", heardWorker);
});
const {counts} = useTabCounts({
    catalogue: props.catalogue,
    subscriptions: props.subscriptions,
    environment: props.environment,
    names: () => [...new Set([...(props.store.layout.value ? props.store.open.value : []), ...props.catalogue.windows.value.map((window) => window.name)])],
});
const {detached, detach, setOption, full, menu, keyed, toggleMenu, split, moveTo, others, aimed, ghost, grabTab, pick, closeTab, closePane, tabsOf, closedWindows, openView, openIn, grabWindow, offer, offerText, answer} = usePaneActions({
    store: props.store,
    area: grid,
    catalogue: props.catalogue,
    counts,
    environment: props.environment,
});

const guide = usePaneGuide(props.environment, {
    isOpen: () => menu.value !== null,
    open: () => (menu.value = leaves(props.store.layout.value.tree)[0]),
    close: () => (menu.value = null),
});
followFullscreen();
const quickOpen = ref(false);
const schemeLabel = computed(() => SCHEMES.find((scheme) => scheme.key === colorScheme.value)?.label ?? "");
function messageTheAgent(words = "") {
    const composer = document.querySelector(".composer-input");
    if (!composer) return void openView("messages.chat");
    if (words) {
        composer.value = words;
        composer.dispatchEvent(new Event("input", {bubbles: true}));
    }
    composer.focus();
}
const quickCommands = computed(() => [
    {label: "Message the agent", keys: "write send", icon: "arrow", run: () => messageTheAgent()},
    ...[...props.catalogue.windows.value, ...props.catalogue.pages.value].map((window, index) => ({label: `Go to ${window.title}`, keys: window.title, key: index < 9 ? String(index + 1) : "", markIcon: window.icon || "window", run: () => goTo(window.name)})),
    ...(currentTask.value ? [{label: `Open the task in hand: ${currentTask.value.title}`, keys: "task work current doing", icon: "activity", run: () => peekRef(`tasks:${currentTask.value.id}`)}] : []),
    {label: shell.wide ? "Leave full screen" : "Full screen", keys: "full screen wide zen", icon: "wide", run: () => (shell.wide = !shell.wide)},
    ...(props.catalogue.window(FILES_WINDOW) ? [{label: "Open project file", keys: "file files open find", icon: "file", run: () => goTo(FILES_WINDOW)}] : []),
    {label: "Search", keys: "search find everything", icon: "search", run: () => goTo("search.search")},
    {label: "Show what happened while you were away", keys: "away digest recap activity", icon: "activity", run: () => (activityOpen.value = true)},
    {label: "Pause or resume auto mode", keys: "auto mode", icon: "activity", run: () => window.dispatchEvent(new CustomEvent("journal:toggle-auto"))},
    {label: `Color scheme: ${schemeLabel.value}`, keys: "theme dark light color", icon: "wide", run: nextColorScheme},
    {label: activityOpen.value ? "Hide the activity" : "Show the activity", keys: "activity column", icon: "activity", run: toggleActivity},
]);
const SHELL_KEYS = {
    "open-file": () => props.catalogue.window(FILES_WINDOW) && goTo(FILES_WINDOW),
    fullscreen: () => (shell.wide = !shell.wide),
    "leave-fullscreen": () => (shell.wide = false),
    "quick-menu": () => (quickOpen.value = true),
};
function shellKeyed(event) {
    const action = SHELL_KEYS[shellKeyAction(event, {wide: shell.wide, opened: quickOpen.value || Boolean(document.querySelector("[role=dialog]"))})];
    if (!action) return;
    event.preventDefault();
    action();
}
window.addEventListener("keydown", shellKeyed);
onUnmounted(() => window.removeEventListener("keydown", shellKeyed));
const closeMenusOutside = (event) => {
    if (event.target.closest?.(MENU_PARTS)) return;
    menu.value = null;
    adding.value = null;
};
window.addEventListener("click", closeMenusOutside);
onUnmounted(() => window.removeEventListener("click", closeMenusOutside));
const groups = () => props.catalogue.group(closedWindows.value);
const addWindow = (id, name) => {
    openIn(id, name);
    adding.value = null;
};
const barWindows = () => groups().flatMap((group) => group.windows);
const declaredBy = (pane) => props.catalogue.window(pane.active)?.options || [];
</script>

<template>
    <div class="stage-frame">
        <template v-if="sidebarShown">
            <SidebarPages :project="project" :windows="catalogue.pages.value" :environments="environments" :current="environment" :counts="counts" :run="shellRead" :mini="sideMini" />
        </template>
    <div class="pane-stage" @keydown="keyed">
        <template v-if="phone">
            <template v-if="picked">
                <section class="pane phone-pane">
                    <div class="pane-body">
                        <WindowPane
                            :key="picked"
                            :name="picked"
                            :catalogue="catalogue"
                            :subscriptions="subscriptions"
                            :environment="environment"
                            :agent="agentOf(picked)"
                            :visible="true"
                            :prompts="prompts"
                            :shell-read="shellRead"
                            @remove="chosen = ''"
                        />
                    </div>
                </section>
            </template>
            <PhoneNotify />
            <PhoneBar :windows="phoneWindows" :current="picked" :counts="counts" @pick="(name) => (chosen = name)" />
        </template>
        <template v-else>
            <template v-if="shellRead">
                <Breadcrumb :environment="environment" :project="project">
                    <Btn kind="icon" data-top-side aria-label="Show or hide the sidebar" title="Show or hide the sidebar" @click="stepSidebar"><Icon name="list" :size="13" /></Btn>
                    <Btn kind="icon" data-top-search aria-label="Search" title="Search" @click="openView('search.search')"><Icon name="search" :size="13" /></Btn>
                    <Btn kind="icon" class="top-bell" data-top-bell aria-label="Waiting on you" title="Waiting on you" @click="openCount('waiting')">
                        <Icon name="bell" :size="13" />
                        <template v-if="facts.waiting">
                            <span class="top-bell-count" data-top-bell-count>{{ facts.waiting }}</span>
                        </template>
                    </Btn>
                    <Btn kind="icon" class="top-bell" data-top-phone aria-label="Phones" :title="pairedPhones.length ? `${pairedPhones[0].name} is connected` : 'Connect your phone'" @click="openView('phone.phones')">
                        <Icon name="phone" :size="13" />
                        <template v-if="pairedPhones.length">
                            <span class="top-phone-dot" data-top-phone-dot />
                        </template>
                    </Btn>
                    <Btn kind="icon" data-activity-toggle aria-label="Activity" title="Activity" @click="toggleActivity"><Icon name="activity" :size="13" /></Btn>
                    <Btn kind="icon" data-fullscreen aria-label="Full screen" title="Full screen" @click="shell.wide = !shell.wide">
                        <Icon name="wide" :size="13" />
                    </Btn>
                </Breadcrumb>
                <template v-if="openDropdown">
                    <WindowDropdown :name="openDropdown" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :agent="agentRow?.id ?? null" :prompts="prompts" :shell-read="shellRead" @close="openDropdown = null" />
                </template>
            <template v-if="!streamAlive">
                <div class="offline-band" role="status" data-offline-band>The journal is not answering. The page will catch up when it is back.</div>
            </template>
            <template v-if="shellRead">
                <UpdateBand :run="shellRead" />
                <AwayCard :run="shellRead" />
            </template>
            <AgentBar :agent="agentRow" :loading="!agentKnown" :task="currentTask" :helpers="facts.helpers" :waiting="facts.waiting" :workers="usage.agents.filter((row) => row.role === 'worker').length" @open="openCount">
                    <template v-for="window in catalogue.bars.value" :key="window.name">
                        <WindowPane bar :name="window.name" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :agent="agentRow?.id ?? null" :prompts="prompts" :shell-read="shellRead" />
                    </template>
            </AgentBar>
            <InformationBar :agent="agentRow" :jobs="facts.jobs" :usage="usage" :fitness="fitness" :now="now" :run="shellRead" @open="openCount" @changed="readFacts">
                    <template v-if="presets">
                        <LayoutPicker :list="presets" />
                    </template>
            </InformationBar>
            </template>
        </template>
        <template v-if="store.layout.value && !phone && store.ready?.value !== false">
            <PaneGrid ref="grid" :full="full" :stacked="narrow" :rank="chatFirst" :panes="store.panes.value" :splits="store.measured.value.splits" @resize="store.resize">
                <template #pane="{id, pane, state}">
                    <PaneTabs
                        :tabs="tabsOf(id, pane)"
                        :data-tabs-of="id"
                        :insert-at="aimed?.zone === 'tabs' && aimed.id === id ? aimed.index : -1"
                        @grab="(event, key) => grabTab(event, id, key)"
                        @pick="(key) => pick(id, key)"
                        @close="(key) => closeTab(id, key)"
                    >
                        <Btn kind="icon" class="pane-add-button" data-add-window aria-label="Add a window" title="Add a window" @click="adding = adding === id ? null : id"><Icon name="plus" :size="13" /></Btn>
                        <Btn kind="icon" class="pane-menu-button" aria-label="Window settings" title="Window settings" @click="toggleMenu(id)"><Icon name="dots-vertical" :size="13" /></Btn>
                    </PaneTabs>
                    <template v-if="adding === id">
                        <div class="pane-add" role="menu" data-add-bar>
                            <template v-for="window in barWindows()" :key="window.name">
                                <Btn
                                    small
                                    :data-reopen="window.name"
                                    :class="{unavailable: window.unavailable_reason}"
                                    :title="window.unavailable_reason ? `${window.title}: ${window.unavailable_reason}` : window.title"
                                    @pointerdown="!window.unavailable_reason && grabWindow($event, window.name)"
                                    @click="!window.unavailable_reason && addWindow(id, window.name)"
                                >
                                    <MarkIcon :name="window.icon || 'window'" />{{ window.title }}
                                </Btn>
                            </template>
                            <template v-if="!barWindows().length">
                                <span class="pane-add-none">Every window is open</span>
                            </template>
                        </div>
                    </template>
                    <template v-if="menu === id">
                        <div class="pane-menu" role="menu">
                            <Btn data-menu="color-scheme" :title="`Color scheme: ${schemeLabel}`" @click="nextColorScheme">Color scheme: {{ schemeLabel }}</Btn>
                            <Btn data-menu="split-right" :disabled="pane.tabs.length < 2" @click="split(id, 'right')">Split right</Btn>
                            <Btn data-menu="split-below" :disabled="pane.tabs.length < 2" @click="split(id, 'bottom')">Split below</Btn>
                            <template v-if="floats">
                                <Btn data-menu="detach" @click="detach(id)">Detach</Btn>
                            </template>
                            <Btn data-menu="width" @click="setOption(id, 'width', pane.options?.width === 'contained' ? 'full' : 'contained')">{{ pane.options?.width === "contained" ? "Fill" : "Contain" }}</Btn>
                            <template v-if="isAgentWindow(pane.active)">
                                <div class="pane-menu-choice" data-option="agent">
                                    <span>Agent</span>
                                    <Btn data-choice="main" :aria-pressed="!pane.options?.agent" @click="setOption(id, 'agent', null)">Main agent</Btn>
                                    <template v-for="row in followable" :key="row.id">
                                        <Btn :data-choice="row.id" :aria-pressed="pane.options?.agent === row.id" @click="setOption(id, 'agent', row.id)">{{ row.role }} {{ row.id }}</Btn>
                                    </template>
                                </div>
                            </template>
                            <PaneMenuOptions :declared="declaredBy(pane)" :values="pane.options || {}" @set="(key, value) => setOption(id, key, value)" />
                            <template v-for="other in others(id)" :key="other.id">
                                <Btn :data-menu="`move-${other.id}`" @click="moveTo(id, other.id)">Move to {{ other.title }}</Btn>
                            </template>
                            <Btn data-menu="close" :disabled="Object.keys(store.layout.value.panes).length < 2" @click="closePane(id); menu = null">Close</Btn>
                            <template v-if="presets?.presets.value.length">
                                <Btn data-menu="reset" @click="presets.apply(presets.presets.value[0].key); menu = null">Reset layout</Btn>
                            </template>
                        </div>
                    </template>
                    <div :class="['pane-body', {contained: pane.options?.width === 'contained'}]">
                        <template v-if="pane.active">
                            <WindowPane
                                :key="`${pane.active}:${agentOf(pane.active, pane)}`"
                                :name="pane.active"
                                :catalogue="catalogue"
                                :subscriptions="subscriptions"
                                :environment="environment"
                                :agent="agentOf(pane.active, pane)"
                                :visible="state === 'live'"
                                :prompts="prompts"
                                :shell-read="shellRead"
                                @remove="closeTab(id, pane.active)"
                            />
                        </template>
                        <template v-else>
                            <template v-if="catalogue.windows.value.length">
                                <p class="pane-empty">Nothing is open in this pane.</p>
                            </template>
                            <template v-else>
                                <Skeleton shape="rows" />
                            </template>
                        </template>
                    </div>
                    <template v-if="offer?.id === id">
                        <SplitOffer :text="offerText" @pick="answer" />
                    </template>
                    <template v-if="aimed?.id === id && aimed.zone !== 'tabs' && state === 'live'">
                        <DropCompass :zone="aimed.zone" />
                    </template>
                </template>
            </PaneGrid>
        </template>
        <template v-else-if="!phone && store.ready?.value === false">
            <Skeleton shape="cards" />
        </template>
        <template v-if="floats && !phone">
            <DetachedWindows
                :detached="detached"
                :catalogue="catalogue"
                :subscriptions="subscriptions"
                :environment="environment"
                :agent="agent"
                :prompts="prompts"
                :shell-read="shellRead"
            />
        </template>
        <template v-if="!phone">
            <PaneTour :tour="guide" />
        </template>
        <template v-if="ghost">
            <DragGhost v-bind="ghost" />
        </template>
    </div>
        <template v-if="activityOpen">
            <ActivityPanel :events="events" />
        </template>
        <template v-if="shellRead">
            <ResourcePanel :read="shellRead" />
        </template>
        <template v-if="quickOpen">
            <QuickMenu :commands="quickCommands" @close="quickOpen = false" @message="messageTheAgent" />
        </template>
    </div>
</template>

<style scoped>
.offline-band {
    flex: none;
    padding: 5px 16px;
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--danger) 12%, var(--bg));
    font-size: 13px;
}

.stage-frame {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
}

.pane-stage {
    display: flex;
    min-width: 0;
    max-width: 100vw;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.top-bell {
    position: relative;
}

.top-phone-dot {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ok, var(--accent));
}

.top-bell-count {
    position: absolute;
    top: -3px;
    right: -3px;
    min-width: 13px;
    border-radius: 7px;
    background: var(--accent);
    color: #fff;
    font-size: 9px;
    line-height: 13px;
    text-align: center;
}

.pane-add {
    position: absolute;
    top: 34px;
    right: 5px;
    left: 5px;
    z-index: 6;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 6px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.pane-add-none {
    padding: 4px 6px;
    color: var(--text-3);
    font-size: 12px;
}

.pane-body.contained > * {
    max-width: 860px;
    margin-inline: auto;
}

.pane-body {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: auto;
}

.phone-pane {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.pane-body > :deep(.window) {
    box-sizing: border-box;
    height: 100%;
    padding: 16px;
}

.pane-menu {
    position: absolute;
    top: 34px;
    right: 5px;
    z-index: 6;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--bg);
}

.pane-add .unavailable {
    opacity: 0.45;
}

.pane-empty {
    padding: 16px;
    color: var(--text-3);
}

.reopen-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-top: 1px solid var(--line);
}

.reopen-module {
    flex: none;
    white-space: nowrap;
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.04em;
}
</style>
