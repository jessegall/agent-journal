<script setup>
import {nextTick, ref, watch} from "vue";
import {useFollowing} from "../composables/following.js";
import {withoutColourCodes} from "../format/colourCodes.js";

// an output's terminal lines, opened to read: following, the newest line stays in view as lines arrive; a scroll up by hand
// stops the following, and the follow button starts it again and goes to the end
// `feed` is the FeedPaginator of the output's pages, which checks the lines opened at the bottom
const props = defineProps({lines: {type: Array, required: true}, empty: {type: String, default: "No output yet."}, feed: {type: Object, default: null}});
const emit = defineEmits(["older"]);
const box = ref(null);
const {away, scrolled, arrived, toBottom} = useFollowing(box);

watch(
    () => [props.lines, props.lines.length],
    () => nextTick(() => {
        arrived();
        if (box.value) props.feed?.drawn(box.value);
    }),
    {immediate: true}
);

function onScroll(event) {
    scrolled();
    emit("older", event.target);
}
</script>

<template>
    <pre ref="box" class="output-lines" @scroll="onScroll"
        >{{ withoutColourCodes(lines.join("\n")) || empty
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
