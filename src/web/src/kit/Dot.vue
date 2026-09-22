<script setup>
import {computed} from "vue";

const COLOR = {
    started: "var(--progress)",
    blocked: "var(--blocking)",
    parked: "var(--parked)",
    planned: "var(--text-3)",
    done: "var(--progress)",
    asked: "var(--blocking)",
    open: "var(--open)",
    struck: "var(--text-3)",
};
const props = defineProps({kind: {type: String, default: "open"}});
const color = computed(() => COLOR[props.kind] || COLOR.open);
</script>

<template>
    <span class="dot" :style="{borderColor: color, background: kind === 'done' ? color : 'transparent'}" role="img" :aria-label="kind" />
</template>

<style scoped>
.dot {
    flex: none;
    display: inline-block;
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    margin: 0 3px;
    border: 2px solid;
    border-radius: 50%;
}
</style>
