<script setup>
import DashboardGroup from "./DashboardGroup.vue";

defineProps({node: {type: Object, required: true}});
const emit = defineEmits(["open", "file"]);
</script>

<template>
    <section :class="['card', {opens: node.open}]" @click="node.open && emit('open', node.open)">
        <template v-if="node.title">
            <header class="card-head">
                <span class="card-title">{{ node.title }}</span>
                <template v-if="node.note">
                    <span class="card-note">{{ node.note }}</span>
                </template>
            </header>
        </template>
        <DashboardGroup :node="{type: 'stack', gap: 10, children: node.children}" @open="emit('open', $event)" @file="emit('file', $event)" />
    </section>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
}

.card.opens {
    cursor: pointer;
}

.card.opens:hover {
    border-color: var(--border-2);
}

.card-head {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.card-title {
    color: var(--text);
    font-size: 13.5px;
    font-weight: 600;
}

.card-note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
