<script setup>
import {computed, nextTick, onUnmounted, ref, watch} from "vue";
import {TOUR, endTour, touring} from "./tour.js";

const DISMISS_AT = 60;
const FLICK = 0.5;

const props = defineProps({tab: {type: String, required: true}});
const emit = defineEmits(["tab"]);
const step = computed(() => (touring.value === null ? null : TOUR[touring.value]));
const pulled = ref(0);
const dragging = ref(false);
let drag = null;
let lit = [];

function unlight() {
    lit.forEach((el) => el.classList.remove("spot"));
    lit = [];
}

function visibleTop() {
    const probe = document.body.appendChild(document.createElement("div"));
    probe.style.cssText = "position: fixed; top: 0; height: env(safe-area-inset-top); visibility: hidden";
    const top = probe.offsetHeight;
    probe.remove();
    return top;
}

function ring(el, top) {
    el.style.setProperty("--spot-hidden", `${Math.max(0, top - el.getBoundingClientRect().top)}px`);
    el.classList.add("spot");
}

async function light() {
    unlight();
    if (!step.value) return;
    if (step.value.tab && step.value.tab !== props.tab) emit("tab", step.value.tab);
    await nextTick();
    lit = [...document.querySelectorAll(step.value.target)];
    const top = visibleTop();
    lit.forEach((el) => ring(el, top));
}

watch([touring, () => props.tab], light, {immediate: true, flush: "post"});
onUnmounted(unlight);

const go = (by) => (touring.value += by);
const last = computed(() => touring.value === TOUR.length - 1);

function down(event) {
    if (event.target.closest("button")) return;
    drag = {y: event.clientY, t: performance.now(), v: 0};
    dragging.value = true;
    event.currentTarget.setPointerCapture(event.pointerId);
}

function moved(event) {
    if (!drag) return;
    const now = performance.now();
    const dy = Math.max(0, event.clientY - drag.y);
    drag.v = (dy - pulled.value) / Math.max(1, now - drag.t);
    drag.t = now;
    pulled.value = dy;
}

function up() {
    if (!drag) return;
    const flicked = pulled.value > DISMISS_AT || drag.v > FLICK;
    drag = null;
    dragging.value = false;
    pulled.value = 0;
    if (flicked) endTour();
}
</script>

<template>
    <template v-if="step">
        <div
            :class="['tour', {dragging}]"
            role="dialog"
            aria-label="Tour of the app"
            :style="{transform: pulled ? `translateY(${pulled}px)` : undefined}"
            @pointerdown="down"
            @pointermove="moved"
            @pointerup="up"
            @pointercancel="up"
        >
            <small class="tour-count">{{ touring + 1 }} of {{ TOUR.length }}</small>
            <h3 class="tour-title">{{ step.title }}</h3>
            <p class="tour-body">{{ step.body }}</p>
            <div class="tour-buttons">
                <template v-if="touring">
                    <button type="button" class="tour-btn" @click="go(-1)">Back</button>
                </template>
                <template v-else>
                    <button type="button" class="tour-btn" @click="endTour">Skip the tour</button>
                </template>
                <button type="button" class="tour-btn primary" @click="last ? endTour() : go(1)">
                    {{ last ? "Close the tour" : "Next" }}
                </button>
            </div>
        </div>
    </template>
</template>

<style scoped>
.tour {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: calc(70px + var(--safe-bottom, 0px));
    z-index: 57;
    max-width: none;
    padding: 14px 16px 12px;
    border-radius: 16px;
    background: var(--raised);
    box-shadow: 0 10px 30px rgb(0 0 0 / 40%);
    touch-action: none;
    transition: transform 260ms var(--push);
    animation: tour-in 320ms var(--push);
}

.tour.dragging {
    transition: none;
    animation: none;
}

.tour-count {
    color: var(--text-3);
    font-size: 0.8125rem;
}

.tour-title {
    margin: 4px 0 6px;
    font-size: 1.0625rem;
}

.tour-body {
    margin: 0 0 12px;
    color: var(--text-2);
    font-size: 0.9375rem;
}

.tour-buttons {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 8px;
}

.tour-btn {
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    background: var(--sel);
    color: var(--text);
    font: inherit;
    font-weight: 600;
}

.tour-btn.primary {
    background: var(--accent);
    color: #fff;
}

@keyframes tour-in {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
}
</style>
