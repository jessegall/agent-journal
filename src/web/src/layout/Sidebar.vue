<script setup>
import {computed, reactive, ref} from "vue";
import {api} from "../api/client.js";
import FoldGroup from "../kit/FoldGroup.vue";
import Icon from "../kit/Icon.vue";
import {ink, project, tint} from "../identity.js";
import {route} from "../route.js";
import {boardOn, counted, navTypes, store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {rows} from "../sync/rows.js";
import {usePoll} from "../poll.js";

usePoll(...polled.agents);
usePoll(...polled.pages);

const envs = computed(() => rows("environment").filter((e) => !e.completed && !e.data.owner));
const pages = computed(() => store.pages || []);
const draft = reactive({open: false, name: "", error: ""});
const folded = reactive({});
const fold = (key) => {
    folded[key] = !folded[key];
};
const count = (t) => counted(t.name, t.needs_attention ? "unread" : "open");
const live = (name) => store.agents.some((a) => a.data.status && a.data.status !== "stopped" && a.data.env === name);

const tip = ref(null);

function point(e) {
    const item = store.sideMini && e.target.closest(".item, .project");
    const label = item && item.querySelector(".label");
    if (!label) return (tip.value = null);
    const box = item.getBoundingClientRect();
    const count = item.querySelector(".count");
    tip.value = {text: label.textContent.trim(), count: count ? count.textContent.trim() : "", y: box.top + box.height / 2};
}

function newEnv() {
    store.sideMini = false;
    draft.open = true;
}

async function makeEnv() {
    draft.error = "";
    try {
        await api.create("environment", {title: draft.name.trim()});
        draft.open = false;
        draft.name = "";
    } catch (e) {
        draft.error = e.message;
    }
}
</script>

<template>
    <div :class="['side-wrap', {mini: store.sideMini}]">
        <aside class="side" @mouseover="point" @mouseleave="tip = null">
            <a class="project" :href="`#/${route.env}`" :title="project">
                <span class="logo" :style="{background: tint, color: ink}">{{ project.charAt(0).toUpperCase() }}</span>
                <span class="project-name label">{{ project }}</span>
            </a>
            <a :class="['item', 'hub-item', {on: route.page === 'hub'}]" :href="`#/${route.env}/hub`">
                <Icon name="panel" />
                <span class="label">Hub</span>
            </a>
            <FoldGroup class="group" label="Environment" :open="!folded.environment" @toggle="fold('environment')">
                <a :class="['item', {on: !route.page}]" :href="`#/${route.env}`">
                    <Icon name="home" />
                    <span class="label">Home</span>
                </a>
                <template v-for="t in navTypes('environment')" :key="t.name">
                    <a :class="['item', {on: route.page === t.name}]" :href="`#/${route.env}/${t.name}`">
                        <Icon :name="t.icon" />
                        <span class="label">{{ t.title }}s</span>
                        <span :class="['count', {hot: t.needs_attention && count(t)}]">{{ count(t) || "" }}</span>
                    </a>
                </template>
                <a :class="['item', {on: route.page === 'settings'}]" :href="`#/${route.env}/settings`">
                    <Icon name="settings" />
                    <span class="label">Settings</span>
                </a>
            </FoldGroup>
            <FoldGroup class="group" label="Project" :open="!folded.project" @toggle="fold('project')">
                <template v-if="boardOn">
                    <a :class="['item', {on: route.page === 'kanban'}]" :href="`#/${route.env}/kanban`">
                        <Icon name="board" />
                        <span class="label">Board</span>
                        <span class="count">{{ counted("todo") || "" }}</span>
                    </a>
                </template>
                <template v-for="t in navTypes('project')" :key="t.name">
                    <a :class="['item', {on: route.page === t.name}]" :href="`#/${route.env}/${t.name}`">
                        <Icon :name="t.icon" />
                        <span class="label">{{ t.title }}s</span>
                        <span class="count">{{ counted(t.name) || "" }}</span>
                    </a>
                </template>
                <a :class="['item', {on: route.page === 'organization'}]" :href="`#/${route.env}/organization`">
                    <Icon name="agents" />
                    <span class="label">Organization</span>
                </a>
                <a :class="['item', {on: route.page === 'skills'}]" :href="`#/${route.env}/skills`">
                    <Icon name="book" />
                    <span class="label">Skills</span>
                </a>
                <a :class="['item', {on: route.page === 'plugins'}]" :href="`#/${route.env}/plugins`">
                    <Icon name="plug" />
                    <span class="label">Plugins</span>
                </a>
                <a :class="['item', {on: route.page === 'services'}]" :href="`#/${route.env}/services`">
                    <Icon name="terminal" />
                    <span class="label">Services</span>
                </a>
                <template v-for="p in pages" :key="`${p.plugin}.${p.name}`">
                    <a
                        :class="['item', {on: route.page === 'page' && String(route.n) === `${p.plugin}.${p.name}`}]"
                        :href="`#/${route.env}/page/${p.plugin}.${p.name}`"
                    >
                        <Icon :name="p.icon" />
                        <span class="label">{{ p.title }}</span>
                        <span :class="['plugin-dot', p.state]" />
                    </a>
                </template>
            </FoldGroup>
            <FoldGroup class="group" label="Environments" :open="!folded.environments" @toggle="fold('environments')">
                <template v-for="e in envs" :key="e.n">
                    <a :class="['item', {on: route.env === e.title}]" :href="`#/${e.title}`">
                        <span :class="['env-dot', {live: live(e.title)}]" />
                        <span class="label">{{ e.title }}</span>
                    </a>
                </template>
                <button type="button" class="item item-new" @click="newEnv">
                    <Icon name="plus" />
                    <span class="label">New environment</span>
                </button>
                <template v-if="draft.open">
                    <form class="env-new" @submit.prevent="makeEnv">
                        <input
                            v-model="draft.name"
                            class="field"
                            placeholder="a short name"
                            autofocus
                            @keydown.escape="draft.open = false"
                        />
                        <template v-if="draft.error">
                            <p class="error">{{ draft.error }}</p>
                        </template>
                    </form>
                </template>
            </FoldGroup>
            <div class="side-bottom">
                <div class="side-foot side-foot-row">
                    <a class="side-foot-version" :href="`#/${route.env}/about`" title="Version and changelog">
                        <span class="label">Agent journal {{ store.spec.version || "" }}</span>
                    </a>
                </div>
            </div>
        </aside>
        <button
            type="button"
            class="side-toggle"
            :title="store.sideMini ? 'Expand the sidebar' : 'Collapse the sidebar to icons'"
            :aria-expanded="!store.sideMini"
            @click="((store.sideMini = !store.sideMini), (tip = null))"
        >
            <Icon name="back" :size="12" />
        </button>
        <template v-if="tip">
            <Teleport to="body">
                <div class="side-tip" :style="{top: `${tip.y}px`}">
                    {{ tip.text }}
                    <template v-if="tip.count">
                        <span class="side-tip-count">{{ tip.count }}</span>
                    </template>
                </div>
            </Teleport>
        </template>
    </div>
</template>

<style scoped>
.side-wrap {
    position: relative;
    display: flex;
    flex: none;
}

.side {
    width: 236px;
    transition: width 0.24s var(--ease);
    flex: none;
    background: var(--side);
    --fold-bg: var(--side);
    --fold-top: 48px;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 0 0 12px;
    overflow-x: hidden;
    overflow-y: auto;
}
.side > * {
    flex: none;
}
.side > .project {
    position: sticky;
    top: 0;
    z-index: 2;
    height: 48px;
    margin-bottom: -8px;
    padding: 0 18px;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
    background: var(--side);
}
.side > .project:hover {
    background: var(--hover);
}
.side > .group {
    padding-inline: 10px;
}
.project {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    padding: 6px 8px;
    border: 0;
    border-radius: 7px;
    background: none;
    font: inherit;
    font-weight: 600;
    font-size: 13.5px;
    color: var(--text);
    text-align: left;
    text-decoration: none;
    cursor: pointer;
}

.project:hover {
    background: var(--hover);
}

.hub-item {
    margin: 0 10px;
}

.project:hover {
    color: var(--text);
}
.project-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.logo {
    flex: none;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background: #2a2c33;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: var(--text-2);
}
.item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 6px 8px;
    border-radius: 6px;
    color: var(--text-2);
    font-size: 13px;
}
.item:hover {
    background: var(--hover);
    color: var(--text);
}
.item.on {
    background: var(--sel);
    color: var(--text);
}
.item .ico {
    width: 15px;
    height: 15px;
    color: var(--text-3);
}
.plugin-dot {
    width: 6px;
    height: 6px;
    margin-left: auto;
    border-radius: 50%;
    background: var(--text-3);
}

.plugin-dot.ready,
.plugin-dot.starting {
    background: var(--created);
}

.plugin-dot.failed,
.plugin-dot.blocked {
    background: var(--danger);
}

.count {
    margin-left: auto;
    font-size: 12px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}
.count.hot {
    color: var(--accent-text);
    font-weight: 500;
}
.item-new {
    width: 100%;
    border: 0;
    background: none;
    font-size: 13px;
    color: var(--text-3);
    text-align: left;
    cursor: pointer;
}
.item-new:hover {
    background: var(--hover);
    color: var(--text-2);
}
.env-new {
    padding: 4px 8px 8px;
}
.field {
    width: 100%;
    padding: 6px 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
}
.error {
    margin: 6px 0 0;
    font-size: 11.5px;
    color: var(--danger);
}
.env-dot {
    position: relative;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: 1.5px solid var(--text-3);
    background: transparent;
    opacity: 0.7;
    flex: none;
    margin: 0 4px;
}
.env-dot.live {
    border-color: var(--accent);
    background: var(--accent);
    opacity: 1;
}
.side-bottom {
    display: flex;
    flex-direction: column;
    margin: auto 0 -12px;
    position: sticky;
    bottom: -12px;
    background: var(--side);
}
.side-foot {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding: 6px 10px 8px;
    border-top: 1px solid var(--border);
    font-size: 11.5px;
    color: var(--text-3);
    white-space: nowrap;
}
.side-foot-version {
    flex: 1;
    min-width: 0;
    height: 22px;
    margin: 0 -10px 2px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    font-size: 10.5px;
    color: var(--text-3);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
}

.side-foot-version:hover {
    color: var(--text);
}

.label {
    white-space: nowrap;
    transition: opacity 0.16s;
}

.item {
    white-space: nowrap;
    transition:
        background 0.15s,
        padding 0.24s var(--ease);
}

.side-wrap.mini .side {
    width: 56px;
}

.side-wrap.mini .label,
.side-wrap.mini .count,
.side-wrap.mini .plugin-dot,
.side-wrap.mini :deep(.fold-label),
.side-wrap.mini :deep(.fold-count),
.side-wrap.mini :deep(.fold-mark) {
    opacity: 0;
}

.side-wrap.mini .item {
    padding-left: 10.5px;
}

.side-wrap.mini .env-new {
    display: none;
}

.side-wrap :deep(.fold-head)::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 8px;
    left: 8px;
    height: 1px;
    background: var(--border-2);
    opacity: 0;
    transition: opacity 0.16s;
}

.side-wrap.mini :deep(.fold-head)::after {
    opacity: 1;
}

.side-toggle {
    position: absolute;
    top: 37px;
    right: -11px;
    z-index: 5;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 1px solid var(--border-2);
    border-radius: 50%;
    background: var(--side);
    color: var(--text-3);
    cursor: pointer;
    transition:
        color 0.15s,
        border-color 0.15s,
        background 0.15s;
}

.side-toggle:hover {
    border-color: var(--border-3);
    background: var(--hover);
    color: var(--text);
}

.side-toggle :deep(.ico) {
    color: inherit;
    transition: transform 0.24s var(--ease);
}

.side-wrap.mini .side-toggle :deep(.ico) {
    transform: rotate(180deg);
}

.side-tip {
    position: fixed;
    left: 62px;
    z-index: 300;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 26px;
    padding: 0 9px;
    transform: translateY(-50%);
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--sel);
    color: var(--text);
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
    animation: tip-in 0.14s var(--ease) both;
}

.side-tip-count {
    color: var(--text-3);
}

@keyframes tip-in {
    from {
        opacity: 0;
        transform: translate(-4px, -50%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .side,
    .item,
    .label,
    .side-toggle :deep(.ico) {
        transition: none;
    }
}
</style>
