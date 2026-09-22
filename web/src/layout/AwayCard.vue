<script setup>
import CloseButton from "../kit/CloseButton.vue";
import {computed, onUnmounted} from "vue";
import {go, peek, route} from "../route.js";
import {missed} from "../domain/records.js";
import {age, span} from "../format/time.js";
import {away} from "../platform/visibility.js";

const lines = computed(() => missed(away.since).map((n) => ({key: n.ref, n: n.n, text: n.title, age: age(n.created)})));
const forText = computed(() => (away.since ? `${span((away.back - away.since) / 1000)} away` : "last 24 hours"));

function open(n) {
    away.open = false;
    peek("notification", n);
}

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
            <span class="away-title">
                While you were away{{ lines.length ? `: ${lines.length} ${lines.length === 1 ? "notification" : "notifications"}` : "" }}
            </span>
            <span class="away-for">{{ forText }}</span>
            <CloseButton title="Dismiss" @click="away.open = false" />
        </div>
        <div class="away-lines">
            <template v-for="d in lines" :key="d.key">
                <button type="button" class="away-line" @click="open(d.n)">
                    <span>{{ d.text }}</span>
                    <span class="away-age">{{ d.age }}</span>
                </button>
            </template>
            <template v-if="!lines.length">
                <p class="away-line muted">No notifications you missed.</p>
            </template>
        </div>
        <div class="away-foot">
            <span />
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
    background: var(--progress);
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
    border: none;
    background: none;
    width: 100%;
    font: inherit;
    font-size: 12px;
    line-height: 1.45;
    color: var(--text-2);
    text-align: left;
    cursor: pointer;
}

button.away-line:hover {
    background: var(--hover);
    color: var(--text);
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
