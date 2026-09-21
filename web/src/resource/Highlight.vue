<script setup>
import {reactive} from "vue";
import Icon from "../kit/Icon.vue";

const emit = defineEmits(["quote"]);
const mark = reactive({text: "", x: 0, y: 0});

function picked(e) {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";
    if (!text || !selection.rangeCount || !e.currentTarget.contains(selection.anchorNode)) {
        mark.text = "";
        return;
    }
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const box = e.currentTarget.getBoundingClientRect();
    mark.text = text;
    mark.x = rect.left - box.left + rect.width / 2;
    mark.y = rect.top - box.top + e.currentTarget.scrollTop;
}

function quote() {
    const selection = window.getSelection();
    emit("quote", mark.text, selection && selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null);
    mark.text = "";
    window.getSelection().removeAllRanges();
}
</script>

<template>
    <div class="highlight" @mouseup="picked" @keyup="picked">
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
