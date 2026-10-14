<script setup>
defineProps({
    label: {type: String, required: true},
    title: {type: String, required: true},
    open: {type: Boolean, default: false},
    options: {type: Array, required: true},
});
const emit = defineEmits(["toggle", "pick"]);
</script>

<template>
    <span class="shell-pick-wrap">
        <button type="button" class="shell-pick" :title="title" @click="emit('toggle')">{{ label }}</button>
        <Transition name="drop">
            <template v-if="open">
                <div class="shell-menu">
                    <template v-for="option in options" :key="option.key">
                        <button type="button" :class="['shell-row', {on: option.on}]" @click="emit('pick', option)">{{ option.label }}</button>
                    </template>
                </div>
            </template>
        </Transition>
    </span>
</template>

<style scoped>
.shell-pick-wrap {
    position: relative;
}

.shell-pick {
    padding: 2px 6px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 11.5px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
}

.shell-pick:hover {
    background: var(--hover);
}

.shell-pick::after {
    content: " ▾";
    color: var(--text-3);
}

.shell-menu {
    position: absolute;
    top: 26px;
    left: 0;
    z-index: 70;
    min-width: 160px;
    max-height: 260px;
    overflow-y: auto;
    padding: 4px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5);
}

.shell-row {
    display: flex;
    align-items: center;
    gap: 7px;
    width: 100%;
    padding: 6px 9px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
}

.shell-row:hover {
    background: var(--hover);
    color: var(--text);
}

.shell-row.on {
    color: var(--accent-text);
}
</style>
