<script setup>
import Btn from "../kit/Btn.vue";
import ChatLine from "../kit/ChatLine.vue";
import FileSlip from "../kit/FileSlip.vue";
import SwitchCase from "../kit/SwitchCase.vue";

defineProps({
    row: {type: String, required: true},
    handed: {default: null},
    failed: {type: String, default: ""},
    halted: {type: Boolean, default: false},
    stalled: {type: String, default: ""},
    retrying: {type: Boolean, default: false},
    thinking: {type: Array, required: true},
});
const emit = defineEmits(["example", "unhand", "hand", "retry", "ask-again", "keep", "discard"]);
const EXAMPLES = [
    "People sign in before they can change anything",
    "The board gets slow with many cards",
    "Show who changed a card and when",
];
</script>

<template>
    <Transition name="layer">
        <SwitchCase :key="row" :value="row">
            <template #chips>
                <div key="chips" class="row-layer chips">
                    <template v-for="text in EXAMPLES" :key="text">
                        <Btn small @click="emit('example', text)">{{ text }}</Btn>
                    </template>
                </div>
            </template>
            <template #upload>
                <div key="upload" class="row-layer">
                    <FileSlip class="slip" :file="handed" removable @remove="emit('unhand')" />
                    <Btn kind="primary" small @click="emit('hand')">Read it and draft tickets</Btn>
                </div>
            </template>
            <template #failed>
                <div key="failed" class="row-layer">
                    <span class="row-text bad">Couldn't upload {{ failed }}.</span>
                    <Btn small @click="emit('hand')">Try again</Btn>
                </div>
            </template>
            <template #stalled>
                <div key="stalled" class="row-layer">
                    <span class="row-text">
                        {{ halted ? stalled || "The drafting stopped." : "No answer yet. The agent may be busy with other work." }}
                    </span>
                    <template v-if="halted">
                        <Btn small :busy="retrying" @click="emit('retry')">Retry</Btn>
                    </template>
                    <template v-else>
                        <Btn small @click="emit('ask-again')">Ask again</Btn>
                    </template>
                </div>
            </template>
            <template #status>
                <div key="status" class="row-layer">
                    <ChatLine bare shuffled :notes="thinking" />
                </div>
            </template>
            <template #discard>
                <div key="discard" class="row-layer">
                    <span class="row-text">Discard this conversation?</span>
                    <Btn small @click="emit('keep')">Keep</Btn>
                    <Btn kind="danger" small @click="emit('discard')">Discard</Btn>
                </div>
            </template>
        </SwitchCase>
    </Transition>
</template>

<style scoped>
.row-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
}

.chips {
    overflow-x: auto;
    scrollbar-width: none;
}

.chips > :deep(*) {
    flex: none;
}

.row-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.phone .row-text {
    line-height: 16px;
    white-space: normal;
}

.row-text.bad {
    color: var(--danger);
}

.slip {
    flex: 1;
    min-width: 0;
}

/* The fixed rows swap by crossfade: out 120ms, in 180ms starting 60ms later, 3px of travel. */
.layer-enter-active {
    transition:
        opacity 0.18s ease-out 0.06s,
        transform 0.18s var(--ease) 0.06s;
}

.layer-leave-active {
    transition:
        opacity 0.12s ease-in,
        transform 0.12s ease-in;
}

.layer-enter-from {
    opacity: 0;
    transform: translateY(3px);
}

.layer-leave-to {
    opacity: 0;
    transform: translateY(-3px);
}

.phone .row-layer > :deep(.btn) {
    min-height: 40px;
}

@media (prefers-reduced-motion: reduce) {
    .layer-enter-active,
    .layer-leave-active {
        transition-duration: 0.12s;
        transition-delay: 0s;
    }
}
</style>
