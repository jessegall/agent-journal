<script setup>
import PromiseList from "./PromiseList.vue";
import TextDisplay from "./TextDisplay.vue";

defineProps({item: {type: Object, required: true}});
</script>

<template>
    <TextDisplay class="setting-help" :text="item.explains" />
    <PromiseList :lines="item.promises" />
</template>

<style scoped>
.setting-help {
    margin: 0 14px 10px 34px;
    padding: 10px 14px;
    border-left: 2px solid var(--border-2);
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
    white-space: pre-line;
}
</style>
