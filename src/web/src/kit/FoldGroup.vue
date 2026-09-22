<script setup>
defineProps({
    label: {type: String, required: true},
    count: {type: [Number, String], default: ""},
    open: {type: Boolean, default: true},
    flush: {type: Boolean, default: false},
});
const emit = defineEmits(["toggle"]);
</script>

<template>
    <div class="fold-group">
        <button type="button" :class="['fold-head', {flush}]" :aria-expanded="open" @click="emit('toggle')">
            <span class="fold-label">{{ label }}</span>
            <template v-if="count !== ''">
                <span class="fold-count">{{ count }}</span>
            </template>
            <span :class="['fold-mark', {shut: !open}]" />
        </button>
        <template v-if="open">
            <slot />
        </template>
    </div>
</template>

<style scoped>
.fold-group {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.fold-head {
    position: sticky;
    z-index: 1;
    top: var(--fold-top, 0);
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 4px 8px 6px;
    border: 0;
    border-radius: 6px;
    background: var(--fold-bg, var(--bg));
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
}

.fold-head.flush {
    padding-inline: 0;
}

.fold-head.flush .fold-mark {
    margin-right: 6px;
}

.fold-head:hover {
    color: var(--text-2);
}

.fold-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.fold-count {
    color: var(--text-4);
}

.fold-mark {
    flex: none;
    width: 5px;
    height: 5px;
    margin: 0 4px 0 auto;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    opacity: 0.7;
    transform: rotate(45deg);
    transition: transform 0.15s;
}

.fold-mark.shut {
    transform: rotate(-45deg);
}
</style>
