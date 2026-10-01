<script setup>
import Trace from "./Trace.vue";

defineProps({works: {type: Array, required: true}, subagent: {type: Boolean, default: false}});
</script>

<template>
    <section class="block">
        <template v-for="w in works" :key="w.n">
            <div class="work">
                <span :class="['dot', {open: !w.completed}]" />
                <span class="work-title">{{ w.title }}</span>
                <span class="work-when">{{ w.completed ? "ended" : "open" }}</span>
            </div>
            <Trace :resource="w" />
        </template>
        <template v-if="!works.length">
            <p class="none">{{ subagent ? "No work filed by this subagent." : "No work on this agent yet." }}</p>
        </template>
    </section>
</template>

<style scoped>
.work {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-3);
}

.dot.open {
    background: var(--progress);
}

.work-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.work-when {
    font-size: 11.5px;
    color: var(--text-3);
}

.none {
    margin: 0;
    color: var(--text-3);
}
</style>
