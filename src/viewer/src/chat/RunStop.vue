<script setup>
import {nextTick, ref} from "vue";
import Btn from "../kit/Btn.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import {anchorTo, useOutside} from "../composables/outside.js";
import {useEscape, useWindowEvent} from "../composables/windowEvent.js";

// The stop of a run still going, beside its mark or in its docked card: it asks first, below a mark and above a card, with the safe
// choice focused, and closes on Escape, a click outside or a scroll
const props = defineProps({what: {type: String, required: true}, above: Boolean});
const emit = defineEmits(["stop"]);
const button = ref(null);
const panel = ref(null);
const keep = ref(null);
const asking = ref(false);
const place = ref({visibility: "hidden"});
const POP_WIDTH = 276;
const GAP = 6;
const EDGE = 8;

const close = () => (asking.value = false);

async function ask() {
    if (asking.value) return close();
    asking.value = true;
    await nextTick();
    anchorTo(panel.value, button.value);
    const edge = button.value.getBoundingClientRect();
    const left = Math.max(EDGE, Math.min(edge.right - POP_WIDTH + 4, window.innerWidth - POP_WIDTH - EDGE));
    const top = props.above ? edge.top - panel.value.offsetHeight - GAP : edge.bottom + GAP;
    place.value = {left: `${left}px`, top: `${top}px`};
    keep.value.$el.focus();
}

function stop() {
    close();
    emit("stop");
}

useOutside(button, close);
useEscape(close, () => asking.value);
useWindowEvent("scroll", close, true);
</script>

<template>
    <span :class="['run-stop', {asking}]">
        <button
            ref="button"
            type="button"
            :class="['run-stop-button', {on: asking, above}]"
            :aria-label="`Stop ${what}`"
            :data-tip="asking ? null : 'Stop the run'"
            @click.stop="ask"
        >
            <MarkIcon name="stop" />
            <span class="run-stop-hit"></span>
        </button>
        <Teleport to="body">
            <template v-if="asking">
                <div ref="panel" class="run-stop-ask" role="dialog" :aria-label="`Stop ${what}`" :style="place">
                    <p class="run-stop-question">Stop {{ what }} now?</p>
                    <p class="run-stop-note">The run is killed at once. It cannot be resumed or undone.</p>
                    <div class="run-stop-row">
                        <Btn ref="keep" small @click="close">Keep it running</Btn>
                        <Btn class="run-stop-go" kind="danger" small @click="stop">Stop the run</Btn>
                    </div>
                </div>
            </template>
        </Teleport>
    </span>
</template>

<style scoped>
/* it shows while its mark's row or its card is pointed at, and while it asks */
.run-stop {
    display: inline-flex;
    flex: none;
    opacity: 0;
    transition: opacity 0.12s ease;
}

.run-stop.asking {
    opacity: 1;
}

.run-stop-button {
    position: relative;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-4);
    cursor: pointer;
    transition:
        background 0.12s ease,
        color 0.12s ease;
}

.run-stop-button :deep(svg) {
    width: 14px;
    height: 14px;
}

.run-stop-button:hover,
.run-stop-button.on {
    background: color-mix(in srgb, var(--danger) 13%, transparent);
    color: var(--danger);
}

.run-stop-button:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-text) 70%, transparent);
    outline-offset: 0;
}

.run-stop-button::after {
    content: attr(data-tip);
    position: absolute;
    top: calc(100% + 7px);
    right: -2px;
    z-index: 20;
    padding: 4px 9px 5px;
    border: 1px solid var(--tip-edge);
    border-radius: 7px;
    background: var(--tip-bg);
    box-shadow: var(--tip-shadow);
    color: var(--text);
    font-size: 12px;
    line-height: 1.4;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease;
}

.run-stop-button.above::after {
    top: auto;
    bottom: calc(100% + 7px);
}

.run-stop-button[data-tip]:hover::after,
.run-stop-button[data-tip]:focus-visible::after {
    opacity: 1;
    transition-delay: 0.45s;
}

.run-stop-button:not([data-tip])::after {
    display: none;
}

.run-stop-hit {
    position: absolute;
    top: 50%;
    left: 50%;
    display: none;
    width: 44px;
    height: 44px;
    transform: translate(-50%, -50%);
}

.run-stop-ask {
    position: fixed;
    z-index: 40;
    width: 276px;
    padding: 11px 12px 10px;
    border: 1px solid var(--tip-edge);
    border-radius: 10px;
    background: var(--tip-bg);
    box-shadow: var(--tip-shadow);
    color: var(--text);
    font-size: 12.5px;
    line-height: 1.45;
    animation: ask-in 0.16s var(--ease);
}

@keyframes ask-in {
    from {
        opacity: 0;
        transform: translateY(-3px);
    }
}

.run-stop-question {
    margin: 0;
}

.run-stop-note {
    margin: 3px 0 10px;
    color: var(--text-3);
    font-size: 11.5px;
}

.run-stop-row {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
}

/* the stop itself is filled, since it cannot be undone */
.run-stop-go.btn.danger {
    border-color: var(--danger);
    background: var(--danger);
    color: var(--on-danger);
    font-weight: 500;
}

.run-stop-go.btn.danger:hover {
    background: color-mix(in srgb, var(--danger) 86%, var(--text));
    color: var(--on-danger);
}

/* a phone has no hover: a bigger button with a 44 pixel touch area, and no tip */
:global(html.phone .run-stop) {
    opacity: 1;
}

:global(html.phone .run-stop .run-stop-button) {
    width: 26px;
    height: 26px;
}

:global(html.phone .run-stop .run-stop-hit) {
    display: block;
}

:global(html.phone .run-stop .run-stop-button::after) {
    display: none;
}

@media (hover: none) {
    .run-stop {
        opacity: 1;
    }

    .run-stop-hit {
        display: block;
    }

    .run-stop-button::after {
        display: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .run-stop-ask {
        animation: none;
    }
}
</style>
