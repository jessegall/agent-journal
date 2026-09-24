<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect} from "vue";
import TextDisplay from "../kit/TextDisplay.vue";
import OptionsPicker from "../resource/OptionsPicker.vue";
import {EASE, still} from "../composables/hydrate.js";
import {closeQuestion, questionView} from "./questionView.js";
import {answered} from "./answers.js";
import {holding, rows} from "../sync/rows.js";
import {route} from "../route.js";

const ANSWERED_BEAT = 450;
const GROW = 260;
const veil = ref(null);
const card = ref(null);
const inner = ref(null);
const n = questionView.n;
const question = computed(() => answered(rows("question").find((q) => q.n === n) || null));
const leaving = ref(false);
const kept = ref(null);
const shown = computed(() => (leaving.value ? kept.value : question.value || kept.value));
let height = 0;
let growing = null;

watch(question, (q) => q && !leaving.value && (kept.value = q), {immediate: true});

function grow() {
    const box = card.value;
    if (!box?.isConnected || leaving.value) return;
    const next = box.offsetHeight;
    if (height && Math.abs(next - height) > 1 && !still()) {
        growing?.cancel();
        box.classList.add("growing");
        growing = box.animate([{height: `${height}px`}, {height: `${next}px`}], {duration: GROW, easing: EASE});
        growing.finished.then(() => box.classList.remove("growing")).catch(() => {});
    }
    height = next;
}

const sized = new ResizeObserver(() => grow());
watch(inner, (el, before) => {
    if (before) sized.unobserve(before);
    if (el) sized.observe(el);
});

function hold() {
    sized.disconnect();
    growing?.finish();
    const box = card.value;
    if (!box) return;
    const r = box.getBoundingClientRect();
    Object.assign(box.style, {width: `${r.width}px`, height: `${r.height}px`, overflow: "hidden"});
}

watchEffect(() => {
    if (!question.value) holding("question", [n]);
});

async function arrive() {
    await nextTick();
    if (still() || !veil.value) return;
    card.value?.style.setProperty("opacity", "0");
    await veil.value.animate([{opacity: 0}, {opacity: 1}], {duration: 260, easing: EASE}).finished;
    card.value?.style.removeProperty("opacity");
    card.value?.animate(
        [
            {opacity: 0, transform: "translateY(14px) scale(0.985)"},
            {opacity: 1, transform: "none"},
        ],
        {duration: 280, easing: EASE}
    );
}

async function leave() {
    if (leaving.value) return;
    hold();
    leaving.value = true;
    if (!still()) {
        if (card.value)
            await card.value.animate(
                [
                    {opacity: 1, transform: "none"},
                    {opacity: 0, transform: "translateY(10px)"},
                ],
                {duration: 200, easing: "ease-in", fill: "forwards"}
            ).finished;
        await veil.value.animate([{opacity: 1}, {opacity: 0}], {duration: 260, easing: EASE, fill: "forwards"}).finished;
    }
    closeQuestion();
}

watch(
    () => question.value?.completed,
    (done, before) => done && !before && setTimeout(leave, ANSWERED_BEAT)
);

const onKey = (e) => e.key === "Escape" && !route.value.open && leave();
onMounted(() => {
    window.addEventListener("keydown", onKey);
    arrive();
});
onUnmounted(() => {
    window.removeEventListener("keydown", onKey);
    sized.disconnect();
});
</script>

<template>
    <div class="question-layer">
        <div ref="veil" class="question-veil" @click="leave" />
        <template v-if="shown">
            <section ref="card" class="question-card" role="dialog" aria-label="Question">
                <div ref="inner">
                    <p class="question-label">Question</p>
                    <h3 class="question-title">{{ shown.title }}</h3>
                    <template v-if="shown.abstract">
                        <TextDisplay class="question-context" :text="shown.abstract" />
                    </template>
                    <OptionsPicker :resource="shown" @elaborated="leave" />
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped>
.question-layer {
    position: absolute;
    inset: 0;
    z-index: 21;
    display: grid;
    place-items: center;
    padding: 16px;
}

.question-veil {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--bg) 55%, transparent);
    backdrop-filter: blur(6px) saturate(0.8);
}

.question-card {
    position: relative;
    box-sizing: border-box;
    width: min(520px, 100%);
    max-height: 100%;
    overflow-y: auto;
    padding: 14px 16px 16px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
    overflow-wrap: anywhere;
}

.question-card.growing {
    overflow: hidden;
}

.question-label {
    margin: 0 0 6px;
    color: var(--blocking);
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.question-title {
    margin: 0 0 6px;
    color: var(--text);
    font-size: 14.5px;
    font-weight: 600;
}

.question-context {
    margin: 4px 0 10px;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
