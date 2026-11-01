<script setup>
import {rememberedRef} from "../windows/rememberedState.js";
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import Skeleton from "../kit/Skeleton.vue";

// the left sidebar as version 4 drew it: a header with the project's mark, then Home and the windows the suite offers in one
// foldable group, each opening where a click on it says, a count beside a window that has one, then the environments
// with the current one marked and the version at the foot
const props = defineProps({
    windows: {type: Array, default: () => []},
    environments: {type: Array, default: () => []},
    current: {type: String, default: ""},
    project: {type: String, default: "agent-journal"},
    counts: {type: Object, default: () => ({})},
    open: {type: String, default: ""},
});
const emit = defineEmits(["open"]);
const foldedNames = rememberedRef("sidebar-folded", []);
const folded = computed(() => new Set(foldedNames.value));
// every window stands in one group for now, in the order the suite lists them
const sections = computed(() => (props.windows.length ? [{module: "windows", title: "Windows", windows: props.windows}] : []));

// each window has its own address; a plain click on the home page opens it in a pane, any other click follows the address
const pageOf = (name) => `?environment=${encodeURIComponent(props.current)}&page=${encodeURIComponent(name)}`;

function go(event, window) {
    if (window.unavailable_reason) return event.preventDefault();
    if (!props.open && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
        event.preventDefault();
        emit("open", window.name);
    }
}

function fold(key) {
    const next = new Set(folded.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    foldedNames.value = [...next];
}
</script>

<template>
    <aside class="sidebar" data-sidebar>
        <div class="sidebar-head">
            <span class="sidebar-logo">A</span>
            <span class="sidebar-name">{{ project }}</span>
        </div>
        <div class="sidebar-scroll">
            <button type="button" class="fold-head" data-fold="environment" @click="fold('environment')">
                Environment<Icon :name="folded.has('environment') ? 'right' : 'down'" :size="12" />
            </button>
            <template v-if="!folded.has('environment')">
                <a :class="['item', {active: !open}]" :href="`?environment=${current}`"><Icon name="home" :size="14" />Home</a>
            </template>
            <template v-if="!windows.length">
                <Skeleton shape="rows" />
            </template>
            <template v-for="section in sections" :key="section.module">
                <button type="button" class="fold-head" :data-fold="section.module" @click="fold(section.module)">
                    {{ section.title }}<Icon :name="folded.has(section.module) ? 'right' : 'down'" :size="12" />
                </button>
                <template v-if="!folded.has(section.module)">
                    <template v-for="window in section.windows" :key="window.name">
                        <a :class="['item', {active: window.name === open}]" :href="pageOf(window.name)" :data-sidebar-window="window.name" :aria-disabled="Boolean(window.unavailable_reason)" @click="go($event, window)">
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
                <template v-for="environment in environments" :key="environment.id">
                    <a :class="['item', {active: environment.name === current}]" :data-environment="environment.name" :href="`?environment=${environment.name}`">
                        <span class="dot" />{{ environment.name }}
                    </a>
                </template>
            </template>
        </div>
        <p class="sidebar-foot">Agent journal</p>
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
    margin: 0;
    padding: 10px 18px;
    border-top: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
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
    background: var(--accent);
}
</style>
