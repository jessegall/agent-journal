<script setup>
import {computed, reactive} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import {negative, project, tint} from "../identity.js";
import {route} from "../route.js";
import {counted, navTypes, store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {load, rows} from "../sync/rows.js";
import {usePoll} from "../poll.js";

usePoll(...polled.agents);
usePoll(...polled.pages);

const envs = computed(() => rows("environment").filter((e) => !e.completed));
const pages = computed(() => store.pages || []);
const draft = reactive({open: false, name: "", error: ""});
const folded = reactive({});
const fold = (key) => {
    folded[key] = !folded[key];
};
const count = (t) => counted(t.name, t.attention ? "unread" : "open");
const live = (name) => store.agents.some((a) => a.data.status && a.data.status !== "stopped" && a.data.env === name);

async function makeEnv() {
    draft.error = "";
    try {
        await api.create("environment", {title: draft.name.trim()});
        draft.open = false;
        draft.name = "";
        await load("environment");
    } catch (e) {
        draft.error = e.message;
    }
}
</script>

<template>
    <aside class="side">
        <a class="project" :href="`#/${route.env}`" :title="project">
            <span class="logo" :style="{background: tint, color: negative}">{{ project.charAt(0).toUpperCase() }}</span>
            <span class="project-name">{{ project }}</span>
        </a>
        <a :class="['item', 'hub-item', {on: route.page === 'hub'}]" :href="`#/${route.env}/hub`">
            <Icon name="panel" />
            Hub
        </a>
        <div class="group">
            <button type="button" class="group-label fold-head" :aria-expanded="!folded.environment" @click="fold('environment')">
                Environment
                <span :class="['fold', {shut: folded.environment}]" />
            </button>
            <template v-if="!folded.environment">
                <a :class="['item', {on: !route.page}]" :href="`#/${route.env}`">
                    <Icon name="home" />
                    Home
                </a>
                <template v-for="t in navTypes('environment')" :key="t.name">
                    <a :class="['item', {on: route.page === t.name}]" :href="`#/${route.env}/${t.name}`">
                        <Icon :name="t.icon" />
                        {{ t.title }}s
                        <span :class="['count', {hot: t.attention && count(t)}]">{{ count(t) || "" }}</span>
                    </a>
                </template>
                <a :class="['item', {on: route.page === 'settings'}]" :href="`#/${route.env}/settings`">
                    <Icon name="settings" />
                    Settings
                </a>
            </template>
        </div>
        <div class="group">
            <button type="button" class="group-label fold-head" :aria-expanded="!folded.project" @click="fold('project')">
                Project
                <span :class="['fold', {shut: folded.project}]" />
            </button>
            <template v-if="!folded.project">
                <template v-for="t in navTypes('project')" :key="t.name">
                    <a :class="['item', {on: route.page === t.name}]" :href="`#/${route.env}/${t.name}`">
                        <Icon :name="t.icon" />
                        {{ t.title }}s
                        <span class="count">{{ counted(t.name) || "" }}</span>
                    </a>
                </template>
                <a :class="['item', {on: route.page === 'skills'}]" :href="`#/${route.env}/skills`">
                    <Icon name="book" />
                    Skills
                </a>
                <a :class="['item', {on: route.page === 'plugins'}]" :href="`#/${route.env}/plugins`">
                    <Icon name="plug" />
                    Plugins
                </a>
                <a :class="['item', {on: route.page === 'services'}]" :href="`#/${route.env}/services`">
                    <Icon name="terminal" />
                    Services
                </a>
                <template v-for="p in pages" :key="`${p.plugin}.${p.name}`">
                    <a
                        :class="['item', {on: route.page === 'page' && String(route.n) === `${p.plugin}.${p.name}`}]"
                        :href="`#/${route.env}/page/${p.plugin}.${p.name}`"
                    >
                        <Icon :name="p.icon" />
                        {{ p.title }}
                        <span :class="['plugin-dot', p.state]" />
                    </a>
                </template>
            </template>
        </div>
        <div class="group">
            <button type="button" class="group-label fold-head" :aria-expanded="!folded.environments" @click="fold('environments')">
                Environments
                <span :class="['fold', {shut: folded.environments}]" />
            </button>
            <template v-if="!folded.environments">
                <template v-for="e in envs" :key="e.n">
                    <a :class="['item', {on: route.env === e.title}]" :href="`#/${e.title}`">
                        <span :class="['env-dot', {live: live(e.title)}]" />
                        {{ e.title }}
                    </a>
                </template>
                <button type="button" class="item item-new" @click="draft.open = true">
                    <Icon name="plus" />
                    New environment
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
            </template>
        </div>
        <div class="side-bottom">
            <div class="side-foot side-foot-row">
                <span class="side-foot-version">Agent journal {{ store.spec.version || "" }}</span>
            </div>
        </div>
    </aside>
</template>

<style scoped>
.side {
    width: 236px;
    flex: none;
    background: var(--side);
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
    height: 48px;
    margin-bottom: -8px;
    padding: 0 18px;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
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
.group {
    display: flex;
    flex-direction: column;
    gap: 1px;
}
.group-label {
    font-size: 11.5px;
    font-weight: 500;
    color: var(--text-3);
    padding: 4px 8px 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.fold-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: none;
    border: 0;
    text-align: left;
    cursor: pointer;
    border-radius: 6px;
}
.fold-head:hover {
    color: var(--text-2);
}
.fold {
    width: 5px;
    height: 5px;
    margin-right: 4px;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg);
    transition: transform 0.15s;
    opacity: 0.7;
}
.fold.shut {
    transform: rotate(-45deg);
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
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
