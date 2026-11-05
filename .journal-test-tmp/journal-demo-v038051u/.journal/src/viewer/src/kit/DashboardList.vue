<script setup>
import DashboardBadge from "./DashboardBadge.vue";

defineProps({items: {type: Array, required: true}});
const emit = defineEmits(["open"]);
</script>

<template>
    <div class="list">
        <template v-for="(item, at) in items" :key="at">
            <component
                :is="item.open ? 'button' : 'div'"
                :type="item.open ? 'button' : undefined"
                :class="['list-item', {opens: item.open}]"
                @click="item.open && emit('open', item.open)"
            >
                <span class="list-label">{{ item.label }}</span>
                <template v-if="item.badge">
                    <DashboardBadge :text="item.badge" :tone="item.tone || ''" />
                </template>
                <template v-if="item.note">
                    <span class="list-note">{{ item.note }}</span>
                </template>
            </component>
        </template>
    </div>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.list-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
}

.list-item.opens {
    cursor: pointer;
}

.list-item.opens:hover {
    background: var(--hover);
}

.list-label {
    flex: 1;
    min-width: 0;
}

.list-note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
