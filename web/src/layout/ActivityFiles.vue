<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";
import {age} from "../format/time.js";

const EVERY = 4000;
const changes = ref([]);
const settled = ref(false);

async function read() {
    try {
        changes.value = (await api.changes()).changes || [];
    } catch {
        changes.value = [];
    }
}

const reading = setInterval(read, EVERY);
onMounted(() => {
    read();
    setTimeout(() => (settled.value = true), 400);
});
onUnmounted(() => clearInterval(reading));
</script>

<template>
    <TransitionGroup tag="div" class="activity-list" :name="settled ? 'act' : ''">
        <div v-for="change in changes" :key="`${change.at}-${change.path}`" class="activity-row">
            <span class="activity-text">
                {{ change.path.split("/").pop() }}
                <span :class="['activity-kind', change.kind]">{{ change.kind }}</span>
            </span>
            <span class="activity-title">{{ change.path }}</span>
            <span class="activity-age">
                <template v-if="change.added">
                    <span class="activity-added">+{{ change.added }}</span>
                </template>
                <template v-if="change.removed">
                    <span class="activity-removed">−{{ change.removed }}</span>
                </template>
                {{ age(change.at) || "just now" }}
            </span>
        </div>
        <p v-if="!changes.length" key="none" class="activity-none">No file has changed yet.</p>
    </TransitionGroup>
</template>

<style scoped>
.activity-list {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 0 12px;
}

.activity-row {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 5px 8px;
}

.activity-text {
    font-size: 12px;
    color: var(--text-2);
    line-height: 1.45;
    overflow-wrap: anywhere;
}

.activity-title {
    font-size: 11.5px;
    color: var(--text-3);
    line-height: 1.4;
    overflow-wrap: anywhere;
}

.activity-age {
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
    opacity: 0.8;
}

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
    position: absolute;
    left: 0;
    right: 0;
    transition: opacity 0.18s ease-in;
}

.act-leave-to {
    opacity: 0;
}

.act-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.activity-kind {
    margin-left: 5px;
    font-size: 10px;
    color: var(--text-3);
}

.activity-kind.created {
    color: var(--created);
}

.activity-kind.deleted {
    color: var(--danger);
}

.activity-added {
    margin-right: 5px;
    color: var(--created);
}

.activity-removed {
    margin-right: 5px;
    color: var(--danger);
}

.activity-none {
    margin: 10px 8px;
    font-size: 12px;
    color: var(--text-3);
}
</style>
