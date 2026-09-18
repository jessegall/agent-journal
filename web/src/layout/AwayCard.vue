<script setup>
import {computed, onUnmounted} from "vue";
import Icon from "../kit/Icon.vue";
import {go, route} from "../route.js";
import {age, away, byRef, meta, span, store, types, unreadByUser, word} from "../store.js";

const lines = computed(() =>
    [...store.events]
        .reverse()
        .filter(
            (e) =>
                e.actor === "agent" &&
                e.at * 1000 >= away.since &&
                meta(e.type).notify.includes("user") &&
                ["created", "completed"].includes(e.action)
        )
        .slice(0, 6)
        .map((e) => ({
            key: e.id,
            text: `${e.action === "completed" ? `${meta(e.type).title} ${word(e.type, "complete")}` : `New ${meta(e.type).title.toLowerCase()}`} ${e.n}${(byRef(`${e.type}:${e.n}`) || {}).title ? ` — ${byRef(`${e.type}:${e.n}`).title}` : ""}`,
            age: age(e.at),
        }))
);
const waiting = computed(() => types.value.filter((t) => t.attention).flatMap((t) => unreadByUser(t.name)).length);
const forText = computed(() => (away.since ? `${span((away.back - away.since) / 1000)} away` : "last 24 hours"));

function toInbox() {
    away.open = false;
    go(route.value.env);
}
const onEscape = (e) => {
    if (e.key === "Escape" && away.open) away.open = false;
};
window.addEventListener("keydown", onEscape);
onUnmounted(() => window.removeEventListener("keydown", onEscape));
</script>

<template>
    <div class="away-card" role="status">
        <div class="away-head">
            <span class="away-dot" />
            <span class="away-title">While you were away</span>
            <span class="away-for">{{ forText }}</span>
            <button type="button" class="away-close" title="Dismiss" @click="away.open = false"><Icon name="close" /></button>
        </div>
        <div class="away-lines">
            <template v-for="d in lines" :key="d.key">
                <div class="away-line">
                    <span>{{ d.text }}</span>
                    <span class="away-age">{{ d.age }}</span>
                </div>
            </template>
            <template v-if="!lines.length">
                <p class="away-line muted">Nothing new from the agent.</p>
            </template>
        </div>
        <div class="away-foot">
            <span>{{ waiting ? `${waiting} waiting on you` : "Nothing waiting on you" }}</span>
            <button type="button" class="away-go" @click="toInbox">Open the chat</button>
        </div>
    </div>
</template>

<style scoped>
.away-card {
    position: fixed;
    z-index: 53;
    right: 18px;
    bottom: 18px;
    width: min(340px, calc(100vw - 36px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #33363d;
    border-radius: 12px;
    background: #17181b;
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55);
    animation: away-in 0.24s cubic-bezier(0.22, 0.7, 0.2, 1) both;
}

@keyframes away-in {
    from {
        opacity: 0;
        transform: translateY(14px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

.away-head {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 13px;
    border-bottom: 1px solid var(--border);
}

.away-dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #6fae7d;
}

.away-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text);
}

.away-for {
    flex: none;
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
}

.away-close {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    border-radius: 5px;
    background: transparent;
    color: var(--text-3);
    cursor: pointer;
}

.away-close:hover {
    background: #212329;
    color: var(--text);
}

.away-close .ico {
    width: 12px;
    height: 12px;
}

.away-lines {
    display: flex;
    flex-direction: column;
    max-height: 260px;
    overflow-y: auto;
    padding: 6px;
}

.away-line {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 0;
    padding: 6px 7px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.45;
    color: var(--text-2);
}

.away-line > span:first-child {
    flex: 1;
    min-width: 0;
    text-wrap: pretty;
}

.away-line.muted {
    color: var(--text-3);
}

.away-age {
    flex: none;
    font-size: 11px;
    color: var(--text-3);
}

.away-foot {
    flex: none;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 13px;
    border-top: 1px solid var(--border);
    background: #151619;
}

.away-foot > span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11.5px;
    color: var(--text-3);
}

.away-go {
    height: 24px;
    padding: 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.away-go:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
