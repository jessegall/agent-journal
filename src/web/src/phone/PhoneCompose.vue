<script setup>
import {computed, inject, nextTick, ref} from "vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import {fitLines} from "../composables/fitLines.js";
import {ended, flush, hold} from "./outbox.js";

const MOST_LINES = 5;
const props = defineProps({about: {type: String, default: ""}});
const emit = defineEmits(["sent", "unabout"]);
const failed = inject("phoneFailed");
const words = ref("");
const box = ref(null);
const sending = ref(false);
const said = computed(() => words.value.trim());

const grow = () => fitLines(box.value, MOST_LINES);

async function send() {
    if (!said.value || sending.value) return;
    sending.value = true;
    hold(said.value, props.about);
    words.value = "";
    nextTick(grow);
    try {
        await flush();
        emit("sent");
    } catch (error) {
        if (ended(error)) failed(error);
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <form class="compose" @submit.prevent="send">
        <template v-if="about">
            <div class="compose-about">
                About {{ about.replace(":", " ") }}
                <CloseButton @click="emit('unabout')" />
            </div>
        </template>
        <div class="compose-bar">
            <textarea
                ref="box"
                v-model="words"
                class="compose-words"
                rows="1"
                placeholder="Message the agent"
                aria-label="Message the agent"
                @input="grow"
            />
            <template v-if="said">
                <button type="submit" class="compose-send" :disabled="sending" aria-label="Send to the agent">
                    <Icon name="up" :size="18" />
                </button>
            </template>
        </div>
    </form>
</template>

<style scoped>
.compose {
    position: sticky;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0 -16px;
    padding: 8px 16px calc(8px + env(safe-area-inset-bottom));
    max-width: none;
    border-top: 1px solid var(--line);
    background: var(--bg);
}

.compose-about {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--accent-text);
    font-size: 13.5px;
}

.compose-bar {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    padding: 5px 5px 5px 14px;
    border: 1px solid var(--border-2);
    border-radius: 22px;
    background: var(--raised);
}

.compose-words {
    flex: 1;
    min-height: 34px;
    padding: 7px 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    line-height: 1.35;
    resize: none;
}

.compose-send {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
}

.compose-send :deep(svg) {
    color: #fff;
    stroke-width: 2.2;
    opacity: 1;
}

.compose-send:disabled {
    opacity: 0.6;
}
</style>
