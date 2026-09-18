<script setup>
import {computed} from "vue";

const COLOR = {started: "#5b8def", blocked: "#d9a441", done: "#3ecf74", asked: "#a78bfa", open: "#8b8e96"};
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
