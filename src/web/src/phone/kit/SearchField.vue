<script setup>
import Icon from "../../kit/Icon.vue";

defineProps({label: {type: String, required: true}});
const words = defineModel({type: String, default: ""});
</script>

<template>
    <label class="search">
        <Icon name="search" :size="17" />
        <input v-model="words" type="search" :placeholder="label" :aria-label="label" enterkeyhint="search" />
    </label>
</template>

<style scoped>
.search {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    margin: 0 0 14px;
    padding: 0 10px;
    border-radius: 10px;
    background: var(--sel);
    color: var(--text-3);
}

.search input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 1.0625rem;
    outline: none;
}
</style>
