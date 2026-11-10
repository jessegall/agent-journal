<script setup>
import {rememberedRef} from "../windows/rememberedState.js";
import {computed, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import NewEnvironment from "./NewEnvironment.vue";
import Skeleton from "../kit/Skeleton.vue";

// the left sidebar as version 4 drew it: a header with the project's mark, then Home and the windows the suite offers in one
// foldable group, each opening where a click on it says, a count beside a window that has one, then the environments
// with the current one marked and the version at the foot
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
// the windows in their groups, each in the order the suite lists them
const inGroup = (group) => shownWindows.value.filter((window) => (window.group || "") === group);
const sections = computed(() => [
    {key: "pages", title: "", windows: [...inGroup(""), ...inGroup("project")]},
    ...inGroup("developer").length ? [{key: "developer", title: "Developer", windows: inGroup("developer")}] : [],
]);

// each page has its own address, which a click follows
const pageOf = (name) => `?environment=${encodeURIComponent(props.current)}&page=${encodeURIComponent(name)}`;

const isPlainClick = (event) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

function go(event, page) {
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
            <span class="sidebar-name">{{ project }}</span>
        </div>
        <div class="sidebar-scroll">
            <template v-if="!shownWindows.length">
                <Skeleton shape="rows" />
            </template>
            <template v-for="section in sections" :key="section.key">
                <template v-if="section.title">
                    <button type="button" class="fold-head" :data-fold="section.key" @click="fold(section.key)">
                        {{ section.title }}<Icon :name="folded.has(section.key) ? 'right' : 'down'" :size="12" />
                    </button>
                </template>
                <template v-if="!folded.has(section.key)">
                    <template v-if="section.key === 'pages'">
                        <a :class="['item', {active: !open}]" :href="`?environment=${current}`"><Icon name="home" :size="14" /><span class="item-title">Home</span></a>
                    </template>
                    <template v-for="window in section.windows" :key="window.name">
                        <a :class="['item', {active: window.name === open}]" :title="window.title" :href="pageOf(window.name)" :data-sidebar-window="window.name" :aria-disabled="Boolean(window.unavailable_reason)" @click="go($event, window)">
                            <MarkIcon :name="window.icon || 'window'" /><span class="item-title">{{ window.title }}</span>
                            <template v-if="counts[window.name]">
                                <span class="item-count">{{ counts[window.name] }}</span>
                            </template>
                        </a>
                    </template>
                </template>
            </template>
            <button type="button" class="fold-head" data-fold="environments" @click="fold('environments')">
                Environments<Icon :name="folded.has('environments') ? 'right' : 'down'" :size="12" />
            </button>
            <template v-if="!folded.has('environments')">
                <template v-if="run">
                    <button type="button" class="item" data-new-environment @click="drafting = true"><Icon name="plus" :size="14" /><span class="item-title">New environment</span></button>
                </template>
                <template v-for="environment in shownEnvironments" :key="environment.id">
                    <a :class="['item', {active: environment.name === current}]" :data-environment="environment.name" :href="`?environment=${environment.name}`">
                        <span :class="['dot', {active: activeEnvironments.includes(environment.id)}]" /><span class="item-title">{{ environment.name }}</span>
                    </a>
                </template>
            </template>
        </div>
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

.sidebar.mini .sidebar-name,
.sidebar.mini .fold-head,
.sidebar.mini .item-title,
.sidebar.mini .item-count,
.sidebar.mini .sidebar-foot {
    display: none;
}

.sidebar.mini .sidebar-head {
    justify-content: center;
    padding: 14px 0;
}

.sidebar.mini .item {
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

.sidebar-name {
    font-size: 14px;
    font-weight: 600;
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
    justify-content: space-between;
    margin-top: 14px;
    padding: 4px 8px;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.fold-head:hover {
    color: var(--text-2);
}

.item-title {
    flex: 1;
}

.item-count {
    color: var(--text-3);
    font-size: 12px;
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

.item {
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

.item:hover,
.item.active {
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
