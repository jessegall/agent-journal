<script setup>
import {computed, reactive, ref} from "vue";
import {create} from "../api.js";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {load, navTypes, open, rows, store, unreadByUser} from "../store.js";

const envs = computed(() => rows("environment").filter((e) => !e.completed));
const draft = reactive({open: false, name: "", error: ""});
const folded = reactive({});
const fold = (key) => {
    folded[key] = !folded[key];
};
const count = (t) => (t.attention ? unreadByUser(t.name).length : open(t.name).length);
const live = (name) => store.agents.some((a) => a.data.status && a.data.status !== "stopped" && a.data.env === name);

async function makeEnv() {
    draft.error = "";
    try {
        await create(route.value.env, "environment", {title: draft.name.trim()});
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
        <a class="project" :href="`#/${route.env}`">
            <span class="logo">{{ route.env.charAt(0).toUpperCase() }}</span>
            {{ route.env }}
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
                        <span class="count">{{ open(t.name).length || "" }}</span>
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
    padding: 12px 0;
    overflow-x: hidden;
    overflow-y: auto;
}
.side > * {
    flex: none;
}
.side > .project {
    margin-inline: 10px;
}
.side > .group {
    padding-inline: 10px;
}
.project {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 6px 8px;
    font-weight: 600;
    font-size: 13.5px;
    color: var(--text);
}
.project:hover {
    color: var(--text);
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
