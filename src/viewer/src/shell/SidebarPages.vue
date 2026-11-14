<script setup>
import {rememberedRef} from "../windows/rememberedState.js";
import {computed, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import NewEnvironment from "./NewEnvironment.vue";
import SidebarRow from "./SidebarRow.vue";
import {vContext} from "../../kit/vContext.js";
import {sidebarSections} from "../domain/sidebarNav.js";
import {copying} from "../domain/contextItems.js";
import {openFileInspector} from "../route.js";
import {placeOnHome} from "../windows/placeOnHome.js";
import Skeleton from "../kit/Skeleton.vue";

// the left sidebar: a header with the project's mark, its name and the current environment's branch and number, then Home
// and the windows the suite offers in foldable groups, each opening where a click on it says, a count beside a window that
// has one, then the environments with the current one marked and the version at the foot
const props = defineProps({
    windows: {type: Array, default: () => []},
    environments: {type: Array, default: () => []},
    activeEnvironments: {type: Array, default: () => []},
    current: {type: String, default: ""},
    project: {type: String, default: ""},
    journalVersion: {type: String, default: ""},
    counts: {type: Object, default: () => ({})},
    open: {type: String, default: ""},
    run: {type: Function, default: null},
    // a page shell that changes its page in place gives this, called with the name of the page a plain click asks for
    navigate: {type: Function, default: null},
    // sends a journal line the way the shell does; with it a window that can also stand in a pane of Home has Place on Home in its menu
    layoutLine: {type: Function, default: null},
    mini: Boolean,
});
// the change log is a page of its own that the sidebar's name and version open, not an item of the list
const UPDATES_PAGE = "updates.updates";
const drafting = ref(false);
const openEnvironment = (name) => (window.location.search = `?environment=${encodeURIComponent(name)}`);
const foldedNames = rememberedRef("sidebar-folded", []);
const folded = computed(() => new Set(foldedNames.value));
// what the sidebar last showed in this browser is drawn at once, so nothing in it moves when the server answers
const lastWindows = rememberedRef("sidebar-windows", []);
const lastEnvironments = rememberedRef("sidebar-environments", []);
const shownWindows = computed(() => (props.windows.length ? props.windows : lastWindows.value));
const shownEnvironments = computed(() => (props.environments.length ? props.environments : lastEnvironments.value));
watch(() => props.windows, (windows) => windows.length && (lastWindows.value = windows), {immediate: true});
watch(() => props.environments, (environments) => environments.length && (lastEnvironments.value = environments), {immediate: true});
// the line under the project's name: the current environment's branch, when it stays on one, and its number
const currentEnvironment = computed(() => shownEnvironments.value.find((environment) => environment.name === props.current));
const environmentLine = computed(() => (currentEnvironment.value ? [currentEnvironment.value.branch, `environment ${currentEnvironment.value.id}`].filter(Boolean).join(" · ") : ""));
// the windows in the design's groups and order; Settings is the foot's row
const sections = computed(() => sidebarSections(shownWindows.value));
const scrolling = computed(() => sections.value.filter((section) => section.key !== "foot"));
const footing = computed(() => sections.value.find((section) => section.key === "foot")?.windows ?? []);

// each page has its own address, which a click follows
const pageOf = (name) => `?environment=${encodeURIComponent(props.current)}&page=${encodeURIComponent(name)}`;

// the menu of a row: open it here or in a new tab, copy its link
const rowPlace = (head, address, enter, reason = "") => ({
    head,
    items: [
        {label: "Open", group: "open", disabled: Boolean(reason), reason: "Not available", run: enter},
        {label: "Open in a new tab", group: "open", disabled: Boolean(reason), reason: "Not available", run: () => window.open(address, "_blank", "noopener")},
        {label: "Copy link", group: "copy", run: ({say}) => copying(new URL(address, location.href).href, "the link", say)},
    ],
});
const PANE_PAGE = "pane_or_page";
const pagePlace = (page) => {
    const place = rowPlace(page.title, pageOf(page.name), () => (props.navigate ? props.navigate(page.name) : location.assign(pageOf(page.name))), page.unavailable_reason);
    if (page.place !== PANE_PAGE || !props.layoutLine) return place;
    const placeIt = async ({say}) => {
        const answer = await placeOnHome(props.layoutLine, props.current, page.name);
        say(answer.ok ? `${page.title} is on Home` : answer.error);
    };
    return {...place, items: [...place.items, {label: "Place on Home", group: "own", run: placeIt}]};
};
const homePlace = () => rowPlace("Home", `?environment=${props.current}`, () => location.assign(`?environment=${props.current}`));
const environmentPlace = (name) => rowPlace(name, `?environment=${name}`, () => openEnvironment(name));

const isPlainClick = (event) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

const FILES_PAGE = "coding.files";

function go(event, page) {
    // Command or Control and a click on Files opens the file inspector over the page instead of leaving it
    if (page.name === FILES_PAGE && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openFileInspector();
        return;
    }
    if (page.unavailable_reason) {
        event.preventDefault();
        return;
    }
    if (!props.navigate || !isPlainClick(event)) return;
    event.preventDefault();
    if (page.name !== props.open) props.navigate(page.name);
}

function fold(key) {
    const next = new Set(folded.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    foldedNames.value = [...next];
}
</script>

<template>
    <aside :class="['sidebar', {mini}]" data-sidebar>
        <div class="sidebar-head">
            <span class="sidebar-logo">A</span>
            <span class="sidebar-title">
                <span class="sidebar-name">{{ project }}</span>
                <template v-if="environmentLine">
                    <span class="sidebar-environment" data-sidebar-environment>{{ environmentLine }}</span>
                </template>
            </span>
        </div>
        <div class="sidebar-scroll">
            <template v-if="!shownWindows.length">
                <Skeleton shape="rows" />
            </template>
            <template v-for="section in scrolling" :key="section.key">
                <template v-if="section.title">
                    <button type="button" class="fold-head" :data-fold="section.key" @click="fold(section.key)">
                        {{ section.title }}
                    </button>
                </template>
                <template v-if="!folded.has(section.key)">
                    <template v-if="section.key === 'pages'">
                        <a v-context="homePlace" :class="['item', {active: !open}]" :href="`?environment=${current}`"><Icon name="home" :size="14" /><span class="item-title">Home</span></a>
                    </template>
                    <template v-for="window in section.windows" :key="window.name">
                        <SidebarRow :page="window" :active="window.name === open" :address="pageOf(window.name)" :count="counts[window.name]?.count" :place="() => pagePlace(window)" @go="go($event, window)" />
                    </template>
                </template>
            </template>
            <button type="button" class="fold-head" data-fold="environments" @click="fold('environments')">
                Environments
            </button>
            <template v-if="!folded.has('environments')">
                <template v-if="run">
                    <button type="button" class="item" data-new-environment @click="drafting = true"><Icon name="plus" :size="14" /><span class="item-title">New environment</span></button>
                </template>
                <template v-for="environment in shownEnvironments" :key="environment.id">
                    <a v-context="() => environmentPlace(environment.name)" :class="['item', {active: environment.name === current}]" :data-environment="environment.name" :href="`?environment=${environment.name}`">
                        <span :class="['dot', {active: activeEnvironments.includes(environment.id)}]" /><span class="item-title">{{ environment.name }}</span>
                    </a>
                </template>
            </template>
        </div>
        <template v-for="window in footing" :key="window.name">
            <SidebarRow class="sidebar-settings" :page="window" :active="window.name === open" :address="pageOf(window.name)" :place="() => pagePlace(window)" @go="go($event, window)" />
        </template>
        <a class="sidebar-foot" :href="pageOf(UPDATES_PAGE)" title="Change log" data-sidebar-footer @click="go($event, {name: UPDATES_PAGE})"><span>Agent journal</span><span>{{ journalVersion }}</span></a>
        <template v-if="drafting">
            <NewEnvironment :run="run" @close="drafting = false" @made="openEnvironment" />
        </template>
    </aside>
</template>

<style scoped>
.sidebar {
    display: flex;
    flex: none;
    flex-direction: column;
    width: 220px;
    min-height: 0;
    border-right: 1px solid var(--border);
    background: var(--side);
}

.sidebar.mini {
    width: 52px;
}

.sidebar.mini .sidebar-title,
.sidebar.mini .fold-head,
.sidebar.mini :deep(.item-title),
.sidebar.mini :deep(.item-count),
.sidebar.mini .sidebar-foot {
    display: none;
}

.sidebar.mini .sidebar-head {
    justify-content: center;
    padding: 14px 0;
}

.sidebar.mini :deep(.item) {
    justify-content: center;
    padding-inline: 0;
}

.sidebar-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
}

.sidebar-logo {
    display: grid;
    width: 20px;
    height: 20px;
    place-items: center;
    border-radius: 6px;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
}

.sidebar-title {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.sidebar-name {
    font-size: 14px;
    font-weight: 600;
}

.sidebar-environment {
    color: var(--text-3);
    font-size: 11px;
}

.sidebar-scroll {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-height: 0;
    padding: 6px 10px;
    overflow-y: auto;
}

.fold-head {
    display: flex;
    align-items: center;
    margin-top: 14px;
    padding: 4px 8px;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
}

.fold-head:hover {
    color: var(--text-2);
}

:deep(.item-title) {
    flex: 1;
}

:deep(.item-count) {
    color: var(--text-3);
    font-size: 12px;
}

.sidebar-settings {
    margin: 0 10px 6px;
}

.sidebar-foot {
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 10px 18px;
    border-top: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
    text-decoration: none;
}

.sidebar-foot:hover {
    color: var(--text-1);
}

:deep(.item) {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 6px 8px;
    border: 0;
    border-radius: 7px;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
}

:deep(.item:hover),
:deep(.item.active) {
    background: var(--raised);
}

.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-3);
}

.dot.active {
    background: var(--accent);
}
</style>
