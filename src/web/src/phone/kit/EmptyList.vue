<script setup>
import Icon from "../../kit/Icon.vue";

defineProps({
    icon: {type: String, required: true},
    title: {type: String, required: true},
    reason: {type: String, required: true},
    action: {type: String, default: ""},
});
const emit = defineEmits(["act"]);
</script>

<template>
    <div class="empty-list">
        <span class="empty-icon" aria-hidden="true"><Icon :name="icon" :size="28" /></span>
        <b class="empty-title">{{ title }}</b>
        <p class="empty-reason">{{ reason }}</p>
        <template v-if="action">
            <button type="button" class="empty-act" @click="emit('act')">{{ action }}</button>
        </template>
    </div>
</template>

<style scoped>
.empty-list {
    display: grid;
    justify-items: center;
    gap: 8px;
    padding: 36px 20px;
    text-align: center;
}

.empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: var(--sel);
    color: var(--text-2);
}

.empty-title {
    font-size: 1.125rem;
}

.empty-reason {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 0.9375rem;
    text-wrap: pretty;
}

.empty-act {
    min-height: 44px;
    padding: 0 18px;
    border: 0;
    border-radius: 12px;
    background: var(--accent);
    color: #fff;
    font: inherit;
    font-weight: 600;
}
</style>
