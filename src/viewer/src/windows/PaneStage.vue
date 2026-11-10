<script setup>
import {computed, nextTick, onMounted, onUnmounted, provide, ref, watch, watchEffect} from "vue";
import {INSPECTOR_HOST, OPEN_VIEW, PANE_PAGE, WINDOW_CONTEXT, windowContext} from "./windowContext.js";
import {moveToPage} from "../shownPage.js";
import LayoutPicker from "../agents/LayoutPicker.vue";
import {useLayoutPresets} from "./layoutPresets.js";
import Btn from "../kit/Btn.vue";
import ButtonAllowance from "./ButtonAllowance.vue";
import Icon from "../kit/Icon.vue";
import {useTabCounts} from "../composables/tabCounts.js";
import {usePaneActions} from "../composables/paneActions.js";
import {coalesced} from "../composables/coalesced.js";
import {useWindowData} from "../../kit/useWindowData.js";
import {SHELL_WINDOW} from "./shellWindow.js";
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
import PaneTabs from "../panes/PaneTabs.vue";
import WindowPane from "./WindowPane.vue";
import PhoneBar from "./PhoneBar.vue";
import PhoneNotify from "./PhoneNotify.vue";
import AgentBar from "../shell/AgentBar.vue";
import InformationBar from "../shell/InformationBar.vue";
import LockdownBand from "../shell/LockdownBand.vue";
import WindowDropdown from "./WindowDropdown.vue";
import ResourcePanel from "../resource/ResourcePanel.vue";
import {RESOURCE_SUBSCRIPTIONS} from "../resource/resourceEvents.js";
import UpdateBand from "../shell/UpdateBand.vue";
import {peekRef} from "../route.js";
import {rememberedRef} from "./rememberedState.js";
import {NO_FACTS} from "../domain/barFacts.js";
import AwayCard from "../shell/AwayCard.vue";
import Breadcrumb from "../shell/Breadcrumb.vue";
import Skeleton from "../kit/Skeleton.vue";
import QuickMenu from "../shell/QuickMenu.vue";
import LoginLink from "../shell/LoginLink.vue";
import {colorScheme, nextColorScheme, pageTitle, SCHEMES} from "./colorScheme.js";
import {shellKeyAction} from "./shellKeys.js";
import SidebarPages from "../shell/SidebarPages.vue";
import ActivityPanel from "../shell/ActivityPanel.vue";
import PaneAddBar from "./PaneAddBar.vue";
import PaneMenu from "./PaneMenu.vue";
import StageTopButtons from "./StageTopButtons.vue";

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
    journalVersion: {type: String, default: ""},
});

const context = props.shellRead ? windowContext({
    window: SHELL_WINDOW,
    environment: props.environment,
    agent: props.agent,
    page: props.page,
    visible: () => true,
    permissions: {reads: [], runs: [], missing: [], ask: async () => true},
    events: ["agent.*", "phone.*", "task.*", "question.*", "scheduled_job.*", "process.*", "setting.*", "output.*"],
    subscriptions: props.subscriptions,
    open: (name) => goTo(name),
}) : null;
if (context) {
    Object.assign(context, useWindowData(context));
    context.state["suite-presets.environment"] = props.environment;
    context.state["suite-presets.page"] = props.page;
    context.state["person-presets.page"] = props.page;
    provide(WINDOW_CONTEXT, context);
    onUnmounted(() => {
        context.cancel();
        props.subscriptions.stopAll(SHELL_WINDOW);
    });
}
const propData = (name, initial) => computed(() => context?.props[name].data.value ?? initial);
provide(INSPECTOR_HOST, {catalogue: props.catalogue, subscriptions: props.subscriptions, environment: props.environment, prompts: props.prompts, shellRead: props.shellRead});
const presets = props.shellRead ? useLayoutPresets({environment: props.environment, page: props.page, shellLine: props.shellRead, window: context, catalogue: props.catalogue, store: props.store}) : null;
const isAgentWindow = (name) => props.catalogue.window(name)?.shows === "one-agent";
// an agent window follows the page's main agent unless its pane was set to another
function agentOf(name, pane = null) {
    const mainAgent = props.catalogue.dropdown(name) ? agentRow.value?.id ?? null : null;
    if (isAgentWindow(name)) return pane?.options?.agent ?? props.agent ?? mainAgent;
    return mainAgent;
}
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
const agentRow = computed(() => usage.value.agents.find((row) => row.role === "main") ?? null);
const agentKnown = computed(() => Boolean(context?.props.usage.data.value));
const environmentData = propData("environments", {rows: []});
const environments = computed(() => environmentData.value.rows);
const activeData = propData("active-environments", {environment_ids: []});
const activeEnvironments = computed(() => activeData.value.environment_ids);
const activityData = propData("activity", {rows: []});
const events = computed(() => activityData.value.rows);
const activityOpen = rememberedRef("activity-open", false);
const wideKept = rememberedRef("full-screen", false);
shell.wide = wideKept.value;
watch(() => shell.wide, (wide) => (wideKept.value = wide));
const SIDEBAR_FROM_WIDTH = 1100;
const sideHidden = rememberedRef("shell.side-hidden", false);
const sideMini = rememberedRef("shell.side-mini", false);
// the sidebar button goes from the whole sidebar to its icons, then to none, then back
function stepSidebar() {
    if (sideHidden.value) [sideHidden.value, sideMini.value] = [false, false];
    else if (sideMini.value) sideHidden.value = true;
    else sideMini.value = true;
}
const sidebarShown = computed(() => Boolean(props.shellRead) && !phone.value && width.value >= SIDEBAR_FROM_WIDTH && !sideHidden.value);
// the project's name as this browser last knew it, so it does not change when the server answers
const lastProject = rememberedRef("last-project", "");
const project = computed(() => environments.value?.find?.((row) => row.name === props.environment)?.folder?.split("/").pop() || lastProject.value);
watchEffect(() => (lastProject.value = project.value));
watchEffect(() => (document.title = pageTitle(props.environment, project.value)));
const EVENT_READ_GAP_MS = 5000;
watch(activityOpen, (open) => {
    if (context) context.state.tab = open ? "activity" : "";
}, {immediate: true});
function toggleActivity() {
    activityOpen.value = !activityOpen.value;
}
const facts = propData("bars", NO_FACTS);
const currentTask = computed(() => (facts.value.task_id ? {id: facts.value.task_id, title: facts.value.task_title, planId: facts.value.task_plan_id} : null));
// the window that lists what each count in the bars counts
const COUNT_WINDOWS = {workers: "workers.workers", skills: "skills.skills", jobs: "schedules.jobs", tasks: "tasks.tasks", waiting: "questions.questions", agents: "agents.agents", usage: "usage.usage", cost: "usage.cost", context: "usage.context", fitness: "usage.fitness", load: "usage.load"};
// the agents an agent sends off, one umbrella in the bar: each type is a group of its dropdown
const HELPER_WINDOW = "agents.helpers";
const usage = propData("usage", {agents: [], windows: [], lockdowns: []});
const fitness = propData("fitness", null);
const branchData = propData("branch", {branch: ""});
const branch = computed(() => branchData.value.branch);
watch(() => context?.props.usage.data.value, (measured) => {
    if (!measured || !agentRow.value) return;
    context.state["fitness.agent"] = String(agentRow.value.number);
    context.reload("fitness");
});
const controlData = propData("controls", {groups: []});
const programData = propData("programs", {rows: []});
const skillData = propData("skills", {rows: []});
watch(() => [agentKnown.value, agentRow.value?.id, agentRow.value?.ended_at], ([known, id, ended]) => {
    if (!known) return;
    if (id && !ended) {
        context.state["controls.agent"] = String(agentRow.value.number);
        context.state["skills.agent"] = String(id);
        context.reload(["controls", "skills"]);
    } else context.reload("programs");
});
const readUsage = () => context?.reload("usage");
// a page opens at its own address and a window in a pane
const pageAddress = (name) => `?environment=${encodeURIComponent(props.environment)}&page=${encodeURIComponent(name)}`;
const goTo = (name) => (props.catalogue.window(name)?.place === "page" ? moveToPage(pageAddress(name)) : openView(name));
provide(OPEN_VIEW, goTo);
provide(PANE_PAGE, props.page);
provide(RESOURCE_SUBSCRIPTIONS, props.subscriptions);
const openDropdown = ref(null);
const windowTitle = (name) => (props.catalogue.dropdown(name) || props.catalogue.window(name)).title;
const helperGroups = () =>
    (props.catalogue.dropdown(HELPER_WINDOW) || props.catalogue.window(HELPER_WINDOW) ? [{name: HELPER_WINDOW, title: windowTitle(HELPER_WINDOW), count: usage.value.agents.filter((row) => row.role !== "main").length}] : []);
const openCount = (key, anchor) => {
    if (key === "cost") readUsage();
    const name = COUNT_WINDOWS[key];
    const groups = key === "helpers" ? helperGroups() : props.catalogue.dropdown(name) ? [{name, title: windowTitle(name), count: 0}] : [];
    if (groups.length) openDropdown.value = {key, groups, anchor};
    else if (props.catalogue.window(name)) goTo(name);
};
const phoneData = propData("phones", {rows: []});
const pairedPhones = computed(() => phoneData.value.rows.filter((row) => row.state === "paired"));
const askBars = coalesced(() => context.reload("bars"), EVENT_READ_GAP_MS, Date.now());
if (context) {
    context.follow(["task.*", "agent.*", "question.*", "scheduled_job.*", "process.*"], askBars);
}
function readFacts() {
    if (context) context.reload(["usage", "phones", ...(context.props.branch.loaded.value ? ["branch"] : [])]);
    if (context) askBars();
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
// a row's reference, such as questions:4, names the window that lists its type, questions.questions
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
    if (linkedRef()) openRef(linkedRef());
});
onUnmounted(() => {
    askBars.cancel();
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
// a pane's menu is drawn over the whole page, under its menu button, so no pane beside or below it covers it
const menuPlace = ref({});
watch(menu, async (id) => {
    if (id === null) return;
    menuPlace.value = {visibility: "hidden"};
    await nextTick();
    const button = document.querySelector(`[data-tabs-of="${id}"] .pane-menu-button`);
    if (!button) return;
    const rect = button.getBoundingClientRect();
    menuPlace.value = {position: "fixed", top: `${rect.bottom + 4}px`, right: `${window.innerWidth - rect.right}px`, zIndex: 1000};
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
const loginLinkOpen = ref(false);
const quickCommands = computed(() => [
    {label: "Message the agent", keys: "write send", icon: "arrow", run: () => messageTheAgent()},
    ...[...props.catalogue.windows.value, ...props.catalogue.pages.value].map((window, index) => ({label: `Go to ${window.title}`, keys: window.title, key: index < 9 ? String(index + 1) : "", markIcon: window.icon || "window", run: () => goTo(window.name)})),
    ...(currentTask.value ? [{label: `Open the task in hand: ${currentTask.value.title}`, keys: "task work current doing", icon: "activity", run: () => peekRef(`tasks:${currentTask.value.id}`)}] : []),
    {label: shell.wide ? "Leave full screen" : "Full screen", keys: "full screen wide zen", icon: "wide", run: () => (shell.wide = !shell.wide)},
    ...(props.catalogue.window(FILES_WINDOW) ? [{label: "Open project file", keys: "file files open find", icon: "file", run: () => goTo(FILES_WINDOW)}] : []),
    {label: "Search", keys: "search find everything", icon: "search", run: () => goTo("search.search")},
    {label: "Log in another browser", keys: "login link browser sign in key", icon: "arrow", run: () => (loginLinkOpen.value = true)},
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
            <SidebarPages :project="project" :journal-version="journalVersion" :windows="catalogue.pages.value" :environments="environments" :active-environments="activeEnvironments" :current="environment" :counts="counts" :run="shellRead" :mini="sideMini" :navigate="goTo" />
        </template>
    <div class="pane-stage" @keydown="keyed">
        <ButtonAllowance :prompts="prompts" />
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
                    <StageTopButtons :waiting="facts.waiting" :paired-phones="pairedPhones" @sidebar="stepSidebar" @view="openView" @count="openCount" @activity="toggleActivity" @wide="shell.wide = !shell.wide" />
                </Breadcrumb>
                <template v-if="openDropdown">
                    <WindowDropdown :groups="openDropdown.groups" :anchor="openDropdown.anchor" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :agent="agentRow?.id ?? null" :prompts="prompts" :shell-read="shellRead" @close="openDropdown = null" />
                </template>
            <template v-if="shellRead">
                <UpdateBand :run="shellRead" />
                <AwayCard :run="shellRead" />
            </template>
            <AgentBar :agent="agentRow" :loading="!agentKnown" :task="currentTask" :helpers="facts.helpers" :processes="facts.processes" :run="shellRead" @open="openCount" @changed="readFacts">
                    <template v-for="window in catalogue.bars.value" :key="window.name">
                        <WindowPane bar :name="window.name" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :agent="agentRow?.id ?? null" :prompts="prompts" :shell-read="shellRead" />
                    </template>
            </AgentBar>
            <InformationBar :control-groups="controlData.groups" :agent-programs="programData.rows" :skills="skillData.rows" @skills="context.reload('skills')" :agent="agentRow" :loading="!agentKnown" :branch="branch" :jobs="facts.jobs" :usage="usage" :fitness="fitness" :run="shellRead" @open="openCount" @changed="readFacts">
                    <span class="bar-buttons">
                        <template v-if="presets">
                            <LayoutPicker :list="presets" />
                        </template>
                    </span>
            </InformationBar>
            <LockdownBand :lockdowns="usage.lockdowns ?? []" @open="(anchor) => openCount('usage', anchor)" />
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
                        <Btn variant="icon" class="pane-add-button" data-add-window aria-label="Add a window" title="Add a window" @click="adding = adding === id ? null : id"><Icon name="plus" :size="13" /></Btn>
                        <Btn variant="icon" class="pane-menu-button" aria-label="Window settings" title="Window settings" @click="toggleMenu(id)"><Icon name="dots-vertical" :size="13" /></Btn>
                    </PaneTabs>
                    <template v-if="adding === id">
                        <PaneAddBar :windows="barWindows()" @grab="grabWindow" @add="(name) => addWindow(id, name)" />
                    </template>
                    <template v-if="menu === id"><Teleport to="body">
                        <PaneMenu
                            :style="menuPlace"
                            :pane="pane"
                            :floats="floats"
                            :followable="followable"
                            :agent-window="isAgentWindow(pane.active)"
                            :declared="declaredBy(pane)"
                            :others="others(id)"
                            :can-close="Object.keys(store.layout.value.panes).length > 1"
                            :can-reset="Boolean(presets?.presets.value.length)"
                            @split="(side) => split(id, side)"
                            @detach="detach(id)"
                            @option="(key, value) => setOption(id, key, value)"
                            @move="(other) => moveTo(id, other)"
                            @close="closePane(id); menu = null"
                            @reset="presets.apply(presets.presets.value[0].key); menu = null"
                        />
                    </Teleport></template>
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
                                :options="pane.options || {}"
                                @option="(key, value) => setOption(id, key, value)"
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
            <ResourcePanel :read="shellRead" :catalogue="catalogue" :environment="environment" />
        </template>
        <template v-if="quickOpen">
            <QuickMenu :commands="quickCommands" @close="quickOpen = false" @message="messageTheAgent" />
        </template>
        <template v-if="loginLinkOpen">
            <LoginLink @close="loginLinkOpen = false" />
        </template>
    </div>
</template>

<style scoped>
.bar-buttons {
    display: inline-flex;
    flex: none;
    gap: 6px;
    align-items: center;
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
