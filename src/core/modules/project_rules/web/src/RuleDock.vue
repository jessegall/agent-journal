<script setup>
import {ref, watch} from "vue";
import {useWindow} from "@journal/window-kit";

// the whole text of a rule an agent proposed, on an orange card so a person sees that it waits on them; the docked item keeps only the start of it
const context = useWindow();
const item = context.option("row");
const rule = ref(null);

async function load() {
    const answer = await context.read(`rule show ${item.value.target_id}`);
    rule.value = answer.ok ? answer.value : null;
}

watch(() => item.value?.target_id, load, {immediate: true});
</script>

<template>
    <p class="rule-dock" data-rule-dock>{{ rule?.text }}</p>
</template>

<style scoped>
.rule-dock {
    margin: 0;
    padding: 8px 10px;
    border: 1px solid var(--warn);
    border-radius: 8px;
    background: color-mix(in srgb, var(--warn) 12%, transparent);
    color: var(--text);
    font-size: 13px;
    line-height: 1.5;
}
</style>
