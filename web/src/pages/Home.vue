<script setup>
import {computed, ref} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {route} from "../route.js";
import {open, types, unreadByUser} from "../store.js";
import Thread from "../chat/Thread.vue";
import Notice from "../chat/Notice.vue";
import AgentBar from "../chat/AgentBar.vue";
import RailWaiting from "./RailWaiting.vue";
import RailTodos from "./RailTodos.vue";
import RailNotes from "./RailNotes.vue";

const tab = ref("waiting");
const notices = computed(() => open("notice"));
const tabs = computed(() => [
    ["waiting", "Waiting on you", types.value.filter((t) => t.attention).flatMap((t) => unreadByUser(t.name)).length, true],
    ["todos", "To-dos", open("todo").length, false],
    ["notes", "Notifications", unreadByUser("notification").length, true],
]);
</script>

<template>
    <div class="home">
        <div class="home-main">
            <section class="home-section home-thread">
                <AgentBar />
                <TransitionGroup name="act">
                    <Notice v-for="x in notices" :key="x.n" :notice="x" />
                </TransitionGroup>
                <Thread />
            </section>
            <div class="home-divider" role="separator" aria-orientation="vertical" />
            <div class="home-rail">
                <div class="rail-tabs" role="tablist">
                    <template v-for="[key, label, n, warm] in tabs" :key="key">
                        <button
                            type="button"
                            role="tab"
                            :aria-selected="tab === key"
                            :class="['rail-tab', {on: tab === key}]"
                            @click="tab = key"
                        >
                            {{ label }}
                            <span :class="['rail-tab-n', {hot: n && warm}]">{{ n }}</span>
                        </button>
                    </template>
                </div>
                <SwitchCase :value="tab">
                    <template #todos><RailTodos /></template>
                    <template #notes><RailNotes /></template>
                    <template #default><RailWaiting /></template>
                </SwitchCase>
            </div>
        </div>
    </div>
</template>

<style scoped>
.act-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.act-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.act-leave-active {
    transition: opacity 0.18s ease-in;
}

.act-leave-to {
    opacity: 0;
}

.act-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.home {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.home-main {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: stretch;
}

.home-thread {
    --home-gutter: 24px;
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    max-width: 1080px;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.home-thread > :deep(.thread) {
    padding: 0 var(--home-gutter);
}

.home-divider {
    flex: none;
    width: 5px;
    margin: 0 -2px;
    cursor: col-resize;
    background: transparent;
    z-index: 3;
}

.home-rail {
    --rail-gutter: 14px;
    flex: none;
    width: clamp(288px, 27%, 400px);
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 0;
    border-left: 1px solid var(--border);
}

.rail-tabs {
    position: sticky;
    top: 0;
    z-index: 2;
    flex: none;
    display: flex;
    align-items: stretch;
    height: 34px;
    padding: 0 var(--rail-gutter);
    gap: 14px;
    border-bottom: 1px solid var(--border);
    background: #111215;
}

.rail-tab-n {
    font-size: 11px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.rail-tab.on .rail-tab-n,
.rail-tab-n.hot {
    color: var(--accent-text);
}

.rail-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    font-size: 11.5px;
    letter-spacing: 0.03em;
    color: var(--text-3);
    white-space: nowrap;
    cursor: pointer;
}

.rail-tab:hover {
    color: var(--text-2);
}

.rail-tab.on {
    color: var(--text);
    box-shadow: inset 0 -1px 0 var(--accent);
}
</style>
