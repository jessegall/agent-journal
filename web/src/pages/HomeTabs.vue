<script setup>
import {go, route} from "../route.js";
import {meta} from "../store.js";

defineProps({waiting: Array, notifications: Array, tab: String});
</script>

<template>
    <div v-if="tab === 'notifications'" class="list">
        <button
            v-for="n in notifications"
            :key="n.n"
            type="button"
            :class="['note', {unseen: !n.seen.includes('user')}]"
            @click="go(route.env, ...n.refs[0].split(':'))"
        >
            <span class="ntitle">{{ n.title }}</span>
            <span class="nabs">{{ n.abstract }}</span>
        </button>
        <p v-if="!notifications.length" class="empty">Nothing yet.</p>
    </div>
    <div v-else class="list">
        <button v-for="r in waiting" :key="r.ref" type="button" class="waiting" @click="go(route.env, r.type, r.n)">
            <span class="wkind">{{ meta(r.type).title }}</span>
            <span class="wtitle">{{ r.title }}</span>
            <span class="wabs">{{ r.abstract || r.brief.slice(0, 300) }}</span>
            <span class="wfoot">{{ r.type }} {{ r.n }}</span>
        </button>
        <p v-if="!waiting.length" class="empty">Nothing waits on you.</p>
    </div>
</template>

<style scoped>
.empty {
    margin: 16px;
    color: var(--text-3);
}

.waiting {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    padding: 12px 14px;
    border: 0;
    border-bottom: 1px solid var(--border);
    background: none;
    text-align: left;
    cursor: pointer;
}

.waiting:hover,
.note:hover {
    background: var(--hover);
}

.wkind {
    color: var(--warn);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.wtitle {
    font-weight: 500;
}

.wabs {
    color: var(--text-2);
    white-space: pre-wrap;
}

.wfoot {
    color: var(--text-3);
    font-size: 11.5px;
}

.note {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 14px;
    border: 0;
    border-bottom: 1px solid var(--border);
    background: none;
    text-align: left;
    cursor: pointer;
    color: var(--text-3);
}

.note.unseen {
    color: var(--text);
}

.nabs {
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
