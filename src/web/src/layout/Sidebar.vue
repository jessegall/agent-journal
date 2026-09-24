<script setup>
import {computed, reactive, ref} from "vue";
import EnvStart from "./EnvStart.vue";
import NewEnvironment from "./NewEnvironment.vue";
import {narrow} from "../platform/view.js";
import FoldGroup from "../kit/FoldGroup.vue";
import Icon from "../kit/Icon.vue";
import {ink, project, tint} from "../identity.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {useNavigation} from "../composables/navigation.js";
import {polled} from "../sync/polled.js";
import {rows} from "../sync/rows.js";
import {usePoll} from "../poll.js";

usePoll(...polled.agents);
usePoll(...polled.pages);

const envs = computed(() => rows("environment").filter((e) => !e.completed && !e.data.owner));
const pages = computed(() => store.pages || []);
const creating = ref(false);
const folded = reactive({});
const fold = (key) => {
    folded[key] = !folded[key];
};
const {sections: groups} = useNavigation();
const live = (name) => name === route.value.env && store.agents.some((a) => a.data.status && a.data.status !== "stopped");

const tip = ref(null);

function point(e) {
    const item = store.sideMini && !narrow.value && e.target.closest(".item, .project");
    const label = item && item.querySelector(".label");
    if (!label) return (tip.value = null);
    const box = item.getBoundingClientRect();
    const count = item.querySelector(".count");
    tip.value = {text: label.textContent.trim(), count: count ? count.textContent.trim() : "", y: box.top + box.height / 2};
}
</script>

<template>
    <div :class="['side-wrap', {mini: store.sideMini && !narrow, narrow}]">
        <aside class="side" @mouseover="point" @mouseleave="tip = null">
            <a class="project" :href="`#/${route.env}`" :title="project">
                <span class="logo" :style="{background: tint, color: ink}">{{ project.charAt(0).toUpperCase() }}</span>
                <span class="project-name label">{{ project }}</span>
            </a>
            <a :class="['item', 'hub-item', {on: route.page === 'hub'}]" :href="`#/${route.env}/hub`">
                <Icon name="panel" />
                <span class="label">Hub</span>
            </a>
            <template v-for="g in groups" :key="g.key">
                <FoldGroup class="group" :label="g.label" :open="!folded[g.key]" @toggle="fold(g.key)">
                    <template v-for="link in g.links" :key="link.key">
                        <a
                            :class="['item', {on: (route.page || '') === link.page}]"
                            :href="['#', route.env, link.page].filter(Boolean).join('/')"
                        >
                            <Icon :name="link.icon" />
                            <span class="label">{{ link.title }}</span>
                            <span :class="['count', {hot: link.hot}]">{{ link.count || "" }}</span>
                        </a>
                    </template>
                    <template v-if="g.key === 'project'">
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
                    </template>
                </FoldGroup>
            </template>
            <FoldGroup class="group" label="Environments" :open="!folded.environments" @toggle="fold('environments')">
                <template v-for="e in envs" :key="e.n">
                    <div class="env-row">
                        <a :class="['item', {on: route.env === e.title}]" :href="`#/${e.title}`">
                            <span :class="['env-dot', {live: live(e.title)}]" />
                            <span class="label">{{ e.title }}</span>
                        </a>
                        <template v-if="!live(e.title)">
                            <EnvStart :env="e" />
                        </template>
                    </div>
                </template>
                <button type="button" class="item item-new" @click="creating = true">
                    <Icon name="plus" />
                    <span class="label">New environment</span>
                </button>
            </FoldGroup>
            <div class="side-bottom">
                <div class="side-foot side-foot-row">
                    <a class="side-foot-version" :href="`#/${route.env}/about`" title="Version and changelog">
                        <span class="label side-foot-name">Agent journal</span>
                        <span class="side-foot-number">{{ store.spec.version || "" }}</span>
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
        <template v-if="creating">
            <NewEnvironment @close="creating = false" />
        </template>
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
.env-row {
    position: relative;
}

.env-row:hover :deep(.env-start) {
    opacity: 1;
}

.side-wrap.mini :deep(.env-start) {
    display: none;
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

.side-foot-name {
    margin-right: 4px;
}

.side-wrap.mini .side-foot-name {
    display: none;
}

.side-wrap.mini .side-foot-version {
    justify-content: center;
    height: 100%;
    margin: 0;
    padding: 0;
}

.side-wrap.mini .side-foot {
    justify-content: center;
    padding: 8px 0;
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

.side-wrap.narrow .side-toggle {
    display: none;
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
