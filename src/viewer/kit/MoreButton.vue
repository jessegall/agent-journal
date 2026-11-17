<script setup>
defineProps({disabled: Boolean});
defineEmits(["click"]);
</script>

<template>
    <button type="button" class="more-button" :disabled="disabled" @click="$emit('click', $event)"><slot>Show more</slot></button>
</template>

<style scoped>
.more-button {
    display: block;
    width: 100%;
    margin: 10px 0 0;
    padding: 10px 16px;
    border: 1px dashed var(--border-3);
    border-radius: 8px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
}
.more-button:hover:not(:disabled) {border-color: var(--accent); color: var(--accent);}
.more-button:focus-visible {outline: 2px solid var(--accent); outline-offset: 2px;}
.more-button:disabled {opacity: .6; cursor: default;}
</style>
