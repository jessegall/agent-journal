<script setup>
import {onUnmounted, reactive, ref} from "vue";
import Icon from "../kit/Icon.vue";

const props = defineProps({off: Boolean});
const emit = defineEmits(["quote"]);
const mark = reactive({text: "", x: 0, y: 0});
const area = ref(null);
let range = null;

function place() {
    if (!range || !area.value) return;
    const rect = range.getBoundingClientRect();
    const box = area.value.getBoundingClientRect();
    mark.x = rect.left - box.left + rect.width / 2;
    mark.y = rect.top - box.top;
}

function picked(e) {
    if (props.off) return;
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";
    if (!text || !selection.rangeCount || !e.currentTarget.contains(selection.anchorNode)) {
        mark.text = "";
        range = null;
        return;
    }
    range = selection.getRangeAt(0).cloneRange();
    mark.text = text;
    place();
}

function quote() {
    emit("quote", mark.text, range);
    mark.text = "";
    range = null;
    window.getSelection().removeAllRanges();
}

window.addEventListener("scroll", place, {capture: true, passive: true});
onUnmounted(() => window.removeEventListener("scroll", place, {capture: true}));
</script>

<template>
    <div ref="area" class="highlight" @mouseup="picked" @keyup="picked">
        <slot />
        <template v-if="mark.text">
            <button type="button" class="highlight-go" :style="{left: `${mark.x}px`, top: `${mark.y}px`}" @mousedown.prevent @click="quote">
                <Icon name="inbox" />
                Comment on this
            </button>
        </template>
    </div>
</template>

<style scoped>
.highlight {
    position: relative;
    height: 100%;
}

.highlight-go {
    position: absolute;
    z-index: 5;
    transform: translate(-50%, calc(-100% - 8px));
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 11px;
    border: 1px solid var(--text);
    border-radius: 99px;
    background: var(--text);
    color: var(--bg);
    font-size: 11.5px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
}

.highlight-go .ico {
    width: 12px;
    height: 12px;
    color: inherit;
}
</style>
