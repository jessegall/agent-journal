<script setup>
import {withoutChips as plain} from "../text/words.js";
import {copyText} from "../kit/copy.js";
import {ref} from "vue";
import Icon from "../kit/Icon.vue";
import ReplyTool from "./ReplyTool.vue";

const FACES = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩"];
const props = defineProps({
    turn: {type: Object, required: true},
    mine: {type: Boolean, required: true},
    text: {type: String, required: true},
    picking: {type: Boolean, default: false},
});
const emit = defineEmits(["reply", "pin", "delete", "react", "update:picking"]);
const copied = ref(false);

async function copy() {
    if (!(await copyText(plain(props.text)))) return;
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
}

function react(face) {
    emit("update:picking", false);
    emit("react", face);
}
</script>

<template>
    <div :class="['thread-tools', {picking}]">
        <template v-if="picking">
            <div class="thread-face-row">
                <template v-for="f in FACES" :key="f">
                    <button type="button" class="thread-face-pick" :title="`React ${f}`" @click.stop="react(f)">{{ f }}</button>
                </template>
            </div>
            <button type="button" class="thread-tool" title="Never mind" @click.stop="emit('update:picking', false)">
                <Icon name="close" />
            </button>
        </template>
        <template v-else>
            <button type="button" class="thread-tool" title="React to this" @click.stop="emit('update:picking', true)">React</button>
            <ReplyTool @reply="emit('reply', {text, ref: turn.ref})" />
            <button type="button" class="thread-tool" title="Pin this over the chat" @click.stop="emit('pin', {text, ref: turn.ref})">
                Pin
            </button>
            <button type="button" class="thread-tool" title="Copy the text of this" @click.stop="copy">
                {{ copied ? "Copied" : "Copy" }}
            </button>
            <template v-if="mine && !turn.completed">
                <button
                    type="button"
                    class="thread-tool"
                    title="Delete it — it comes off the list and stays in the record"
                    @click.stop="emit('delete')"
                >
                    Delete
                </button>
            </template>
        </template>
    </div>
</template>

<style scoped>
.thread-tools {
    position: absolute;
    top: -11px;
    right: -6px;
    display: flex;
    gap: 1px;
    padding: 1px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    background: var(--raised);
    opacity: 0;
    transform: translateY(3px);
    pointer-events: none;
    transition:
        opacity 0.16s ease-out,
        transform 0.16s ease-out;
}

.thread-tools:focus-within {
    opacity: 1;
    transform: none;
    pointer-events: auto;
}

.thread-tools.picking {
    gap: 1px;
    padding: 1px 3px;
}

.thread-tool {
    padding: 1px 7px;
    border: 0;
    border-radius: 99px;
    background: none;
    color: var(--text-3);
    font-size: 10.5px;
    line-height: 1.5;
    cursor: pointer;
    white-space: nowrap;
}

.thread-tool:hover {
    background: var(--hover);
    color: var(--text);
}

.thread-tool .ico {
    width: 11px;
    height: 11px;
}

.thread-face-row {
    display: flex;
    gap: 1px;
    max-width: 144px;
    overflow-x: auto;
    overflow-y: hidden;
}

.thread-face-pick {
    flex: none;
    padding: 0 4px;
    border: 0;
    border-radius: 20px;
    background: transparent;
    font-size: 12px;
    line-height: 18px;
    cursor: pointer;
}

.thread-face-pick:hover {
    background: rgba(255, 255, 255, 0.08);
}
</style>
