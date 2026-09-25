<script setup>
import {computed, onUnmounted, ref} from "vue";
import {store} from "../state/store.js";
import Btn from "./Btn.vue";

const HOLD_SECONDS = 3;
const props = defineProps({
    options: {type: Array, default: () => []},
    chosen: {type: String, default: ""},
    suggested: {type: Number, default: -1},
    disabled: Boolean,
    color: {type: String, default: "var(--accent)"},
    chosenBy: {type: String, default: ""},
    reason: {type: String, default: ""},
    immediate: Boolean,
    tiles: Boolean,
    steady: Boolean,
    multiple: Boolean,
    chosenMany: {type: Array, default: () => []},
});
const emit = defineEmits(["pick", "picks"]);
const ticked = ref([]);
const isChosen = (o) => (props.chosen && props.chosen === o.title) || props.chosenMany.includes(o.title);
const tick = (i) => (ticked.value = ticked.value.includes(i) ? ticked.value.filter((t) => t !== i) : [...ticked.value, i]);
const settle = () =>
    ticked.value.length &&
    emit(
        "picks",
        [...ticked.value].sort((a, b) => a - b)
    );
const holding = ref(-1);
const pressed = ref(-1);
let timer = 0;
const held = computed(() => Number(store.settings?.ask_questions?.hold ?? HOLD_SECONDS) * 1000);

function choose(i) {
    if (props.multiple) return tick(i);
    if (props.immediate) {
        if (pressed.value >= 0) return;
        pressed.value = i;
        return emit("pick", i);
    }
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
    <div :class="['options', {tiles, steady, multiple}]" :style="{'--tone': color}">
        <template v-for="(o, i) in options" :key="i">
            <button
                type="button"
                :class="[
                    'option',
                    {
                        suggested: i === suggested && !disabled,
                        chosen: isChosen(o),
                        ticked: multiple && ticked.includes(i),
                        holding: holding === i,
                        pressed: pressed === i,
                    },
                ]"
                :style="{'--i': i}"
                :disabled="disabled"
                @click="choose(i)"
            >
                <template v-if="tiles">
                    <span class="mark" />
                </template>
                <template v-if="steady">
                    <span class="tick">✓</span>
                </template>
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
        <template v-if="multiple && !disabled">
            <div class="settle">
                <Btn kind="primary" small :disabled="!ticked.length" @click="settle">Continue</Btn>
            </div>
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

.option {
    transition:
        transform 0.12s ease,
        border-color 0.2s ease,
        background 0.2s ease;
}

.option:active:not(:disabled) {
    transform: scale(0.98);
}

.options:has(.pressed) .option:not(.pressed) {
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--fade);
}

.option.pressed {
    border-color: var(--tone);
    background: color-mix(in srgb, var(--tone) 16%, var(--raised));
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

.options.tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 10px;
    padding-top: 8px;
}

.tiles .option {
    overflow: visible;
    gap: 6px;
    padding: 14px 40px 14px 14px;
    border-color: var(--border);
    border-radius: 12px;
    background: linear-gradient(180deg, color-mix(in srgb, var(--tone) 6%, var(--raised)), var(--raised) 70%);
    animation:
        tile-fade var(--fade) backwards,
        tile-rise var(--move) backwards;
    animation-delay: calc(var(--i) * 70ms + 0.1s);
    transition:
        transform var(--move),
        opacity var(--fade),
        border-color 0.2s ease,
        background 0.2s ease,
        box-shadow var(--move);
}

.tiles .option:hover:not(:disabled) {
    box-shadow: 0 12px 28px -14px color-mix(in srgb, var(--tone) 70%, transparent);
    transform: translateY(-2px);
}

.tiles .option:active:not(:disabled) {
    transform: translateY(0) scale(0.99);
}

.tiles .label {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
}

.tiles .desc {
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 18px;
}

.tiles .pick {
    position: absolute;
    top: -9px;
    left: 12px;
    margin: 0;
    padding: 2px 8px;
    border: 1px solid color-mix(in srgb, var(--tone) 40%, var(--border-2));
    border-radius: 999px;
    background: color-mix(in srgb, var(--tone) 22%, var(--raised));
    font-size: 10px;
    line-height: 14px;
}

.mark {
    position: absolute;
    top: 15px;
    right: 14px;
    width: 14px;
    height: 14px;
    border: 1.5px solid var(--border-2);
    border-radius: 50%;
    box-sizing: border-box;
    transition:
        border-color 0.2s ease,
        border-width 0.2s ease,
        background 0.2s ease;
}

.option:hover:not(:disabled) .mark {
    border-color: var(--tone);
}

.pressed .mark,
.chosen .mark {
    border-width: 4px;
    border-color: var(--tone);
}

@keyframes tile-fade {
    from {
        opacity: 0;
    }
}

@keyframes tile-rise {
    from {
        transform: translateY(8px);
    }
}

/* Steady: in a conversation the choices never leave their place. They rise in 50ms apart; once answered, the chosen one
   carries a check and the rest stay put in muted text. */
.steady .option {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    min-height: 36px;
    padding: 7px 12px;
    color: var(--text-2);
    animation: option-rise 0.24s var(--ease) both;
    animation-delay: calc(var(--i) * 50ms + 50ms);
}

.steady .option .label {
    flex: 1;
}

.steady .pick {
    display: none;
}

.options.steady:has(.pressed) .option:not(.pressed),
.steady .option:disabled {
    opacity: 1;
    pointer-events: none;
}

.steady .option:disabled:not(.chosen) {
    border-color: var(--border);
    background: transparent;
    color: var(--text-3);
}

.steady .option.chosen,
.steady .option.ticked,
.steady .option.pressed {
    border-color: var(--tone);
    background: color-mix(in srgb, var(--tone) 16%, var(--raised));
    color: var(--text);
}

.tick {
    display: grid;
    flex: none;
    place-items: center;
    width: 16px;
    height: 16px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    box-sizing: border-box;
    color: transparent;
    font-size: 10px;
    transition:
        border-color 0.12s ease-out,
        background 0.12s ease-out,
        color 0.12s ease-out;
}

.multiple .tick {
    border-radius: 4px;
}

.chosen .tick,
.ticked .tick,
.pressed .tick {
    border-color: var(--tone);
    background: var(--tone);
    color: #fff;
}

.settle {
    display: flex;
    margin-top: 2px;
}

@keyframes option-rise {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .steady .option {
        animation: none;
    }

    .tiles .option {
        animation: none;
        transition-duration: 0.01ms;
    }
}
</style>
