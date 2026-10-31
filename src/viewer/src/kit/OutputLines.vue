<script setup>
import {nextTick, ref, watch} from "vue";
import {useFollowing} from "../composables/following.js";

// an output's terminal lines, opened to read: following, the newest line stays in view as lines arrive; a scroll up by hand
// stops the following, and the follow button starts it again and goes to the end
const props = defineProps({lines: {type: Array, required: true}, empty: {type: String, default: "It printed nothing yet."}});
const emit = defineEmits(["older"]);
const box = ref(null);
const {away, scrolled, arrived, toBottom} = useFollowing(box);

watch(
    () => props.lines.length,
    () => nextTick(() => arrived()),
    {immediate: true}
);

function onScroll(event) {
    scrolled();
    emit("older", event.target);
}
</script>

<template>
    <pre ref="box" class="output-lines" @scroll="onScroll"
        >{{ lines.join("\n") || empty
        }}<template v-if="away"
            ><button type="button" class="output-follow" title="Follow the output: keep its newest line in view as lines arrive" @click="toBottom(true)">Follow</button></template
        ></pre>
</template>

<style scoped>
.output-lines {
    overflow: auto;
}

.output-follow {
    position: sticky;
    bottom: 8px;
    display: block;
    width: fit-content;
    margin-left: auto;
    padding: 3px 10px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
    user-select: none;
}

.output-follow:hover {
    border-color: var(--accent);
}
</style>
