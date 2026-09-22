<script setup>
import {computed, onUnmounted, ref} from "vue";
import {store} from "../state/store.js";

const HOLD_SECONDS = 3;
const props = defineProps({
    options: {type: Array, default: () => []},
    chosen: {type: String, default: ""},
    suggested: {type: Number, default: -1},
    disabled: Boolean,
    color: {type: String, default: "var(--accent)"},
    chosenBy: {type: String, default: ""},
    reason: {type: String, default: ""},
});
const emit = defineEmits(["pick"]);
const holding = ref(-1);
let timer = 0;
const held = computed(() => Number(store.settings?.ask_questions?.hold ?? HOLD_SECONDS) * 1000);

function choose(i) {
    clearTimeout(timer);
    if (holding.value === i) {
        holding.value = -1;
        return;
    }
    holding.value = i;
    timer = setTimeout(save, held.value);
}

function save() {
    const i = holding.value;
    clearTimeout(timer);
    holding.value = -1;
    if (i >= 0) emit("pick", i);
}

onUnmounted(save);
</script>

<template>
    <div class="options" :style="{'--tone': color}">
        <template v-for="(o, i) in options" :key="i">
            <button
                type="button"
                :class="['option', {suggested: i === suggested && !disabled, chosen: chosen && chosen === o.title, holding: holding === i}]"
                :disabled="disabled"
                @click="choose(i)"
            >
                <template v-if="i === suggested && !disabled">
                    <span class="pick">The agent's pick</span>
                </template>
                <template v-if="chosen && chosen === o.title">
                    <span class="pick">{{ chosenBy === "agent" ? "The agent's answer" : "Your answer" }}</span>
                </template>
                <span class="label">{{ o.title }}</span>
                <template v-if="o.description">
                    <span class="desc">{{ o.description }}</span>
                </template>
                <template v-if="o.code">
                    <code class="code">{{ o.code }}</code>
                </template>
                <template v-if="chosen && chosen === o.title && chosenBy === 'agent' && reason">
                    <span class="reason">{{ reason }}</span>
                </template>
                <template v-if="holding === i">
                    <span class="hold-note">Saving this choice… click it again to cancel</span>
                    <span class="hold-bar" :style="{'--hold': `${held}ms`}" />
                </template>
            </button>
        </template>
    </div>
</template>

<style scoped>
.options {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.option {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
    padding: 9px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.option:hover:not(:disabled),
.option.holding {
    border-color: var(--tone);
}

.option.suggested {
    border-color: color-mix(in srgb, var(--tone) 40%, var(--border-2));
}

.option.chosen {
    border-color: var(--tone);
    background: color-mix(in srgb, var(--tone) 12%, var(--raised));
}

.option:disabled {
    opacity: 0.7;
    cursor: default;
}

.hold-note {
    color: color-mix(in srgb, var(--tone) 60%, var(--text));
    font-size: 11.5px;
}

.hold-bar {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    height: 2px;
    background: var(--tone);
    animation: hold var(--hold) linear forwards;
}

@keyframes hold {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

.label {
    display: flex;
    justify-content: space-between;
    gap: 8px;
}

.pick {
    display: block;
    margin: -9px -12px 8px;
    padding: 4px 12px;
    border-radius: 7px 7px 0 0;
    background: color-mix(in srgb, var(--tone) 22%, var(--raised));
    color: color-mix(in srgb, var(--tone) 60%, var(--text));
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.reason {
    margin-top: 4px;
    color: var(--text-3);
    font-size: 11.5px;
    font-style: italic;
}

.desc {
    color: var(--text-3);
    font-size: 12.5px;
}

.code {
    color: var(--text-2);
    font-family: ui-monospace, monospace;
    font-size: 12px;
    white-space: pre-wrap;
}
</style>
