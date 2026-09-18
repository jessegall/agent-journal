<script setup>
import {computed, ref} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route} from "../route.js";
import {open, rows, types, unreadByUser} from "../store.js";
import Chat from "../chat/Chat.vue";
import ResourceRow from "../resource/ResourceRow.vue";
import PlanBar from "../chat/PlanBar.vue";
import HomeTabs from "./HomeTabs.vue";

const tab = ref("waiting");
const waiting = computed(() => types.value.filter((t) => t.attention).flatMap((t) => unreadByUser(t.name)));
const todos = computed(() => open("todo"));
const notifications = computed(() => [...rows("notification")].reverse());
const tabs = computed(() => [
    ["waiting", "Waiting on you", waiting.value.length],
    ["todos", "To-dos", todos.value.length],
    ["notifications", "Notifications", unreadByUser("notification").length],
]);
</script>

<template>
    <div class="home">
        <div class="left">
            <PlanBar />
            <Chat />
        </div>
        <aside class="right">
            <nav class="tabs">
                <button v-for="[key, name, count] in tabs" :key="key" type="button" :class="['tab', {on: tab === key}]" @click="tab = key">
                    {{ name }}
                    <b v-if="count">{{ count }}</b>
                </button>
            </nav>
            <SwitchCase :value="tab">
                <template #todos>
                    <ResourceRow v-for="r in todos" :key="r.n" :resource="r" @click="go(route.env, 'todo', r.n)" />
                    <p v-if="!todos.length" class="empty">Nothing waiting.</p>
                </template>
                <template #default>
                    <HomeTabs :tab="tab" :waiting="waiting" :notifications="notifications" />
                </template>
            </SwitchCase>
        </aside>
    </div>
</template>

<style scoped>
.home {
    display: flex;
    height: 100%;
}

.left {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.right {
    flex: none;
    width: 300px;
    overflow: auto;
    border-left: 1px solid var(--border);
}

.tabs {
    display: flex;
    gap: 14px;
    padding: 0 14px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
    overflow: auto;
}

.tab {
    padding: 12px 0;
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.tab.on {
    color: var(--text);
    border-bottom-color: var(--accent);
}

.tab b {
    margin-left: 6px;
    color: var(--accent-text);
    font-weight: 500;
}

.empty {
    margin: 16px;
    color: var(--text-3);
}
</style>
