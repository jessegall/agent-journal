<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";
import Icon from "../kit/Icon.vue";
import ResourceBody from "../resource/ResourceBody.vue";
import UpdateReport from "../resource/UpdateReport.vue";
import {EASE, hydrate, still} from "../composables/hydrate.js";
import {closeUpdate, updateView} from "./updateView.js";
import {markSeen} from "../sync/seen.js";
import {rows} from "../sync/rows.js";
import {peek, route} from "../route.js";

const FULL = "inset(0px 0px 0px 0px round 0px)";
const LEADS = ".body > .head, .body > .abstract, .body > .controls";
const layer = ref(null);
const ghost = ref(null);
const scroller = ref(null);
const origin = updateView.n;
const shown = ref(origin);
const report = computed(() => rows("report").find((r) => r.n === shown.value) || null);
let busy = false;

const tone = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const card = () => document.querySelector(`.thread [data-update="${origin}"]`);

function cardAt(el) {
    const pane = layer.value.parentElement.getBoundingClientRect();
    const c = el.getBoundingClientRect();
    return {
        clip: `inset(${c.top - pane.top}px ${pane.right - c.right}px ${pane.bottom - c.bottom}px ${c.left - pane.left}px round 9px)`,
        box: {left: `${c.left - pane.left}px`, top: `${c.top - pane.top}px`, width: `${c.width}px`, height: `${c.height}px`},
    };
}

function lay(el) {
    const copy = el.cloneNode(true);
    Object.assign(copy.style, {margin: "0", width: "100%", height: "100%", maxWidth: "none", visibility: "visible"});
    ghost.value.replaceChildren(copy);
    Object.assign(ghost.value.style, cardAt(el).box);
}

async function grow() {
    markSeen("report", [shown.value]);
    await nextTick();
    const from = updateView.from;
    if (still() || !from?.isConnected) return;
    busy = true;
    const at = cardAt(from);
    lay(from);
    from.style.visibility = "hidden";
    scroller.value.style.opacity = "0";
    ghost.value.animate([{opacity: 1}, {opacity: 0}], {duration: 150, easing: "ease-out", fill: "forwards"});
    await layer.value.animate(
        [
            {clipPath: at.clip, backgroundColor: tone("--raised")},
            {clipPath: FULL, backgroundColor: tone("--bg")},
        ],
        {
            duration: 300,
            easing: EASE,
        }
    ).finished;
    ghost.value.replaceChildren();
    scroller.value.style.opacity = "";
    hydrate(scroller.value, {also: LEADS});
    busy = false;
}

function done() {
    [updateView.from, card()].forEach((el) => el && (el.style.visibility = ""));
    closeUpdate();
}

async function shrink() {
    if (busy) return;
    const to = updateView.from?.isConnected ? updateView.from : card();
    if (still() || !to) return done();
    busy = true;
    await scroller.value.animate([{opacity: 1}, {opacity: 0}], {duration: 90, easing: "ease-in", fill: "forwards"}).finished;
    const at = cardAt(to);
    lay(to);
    ghost.value.animate([{opacity: 0}, {opacity: 1}], {duration: 140, delay: 120, easing: "ease-in", fill: "both"});
    await layer.value.animate(
        [
            {clipPath: FULL, backgroundColor: tone("--bg")},
            {clipPath: at.clip, backgroundColor: tone("--raised")},
        ],
        {
            duration: 260,
            easing: EASE,
            fill: "forwards",
        }
    ).finished;
    done();
}

async function step(n) {
    shown.value = n;
    markSeen("report", [n]);
    await nextTick();
    scroller.value.scrollTop = 0;
    hydrate(scroller.value, {also: LEADS});
}

async function toPanel() {
    if (busy) return;
    busy = true;
    peek("report", shown.value);
    if (!still()) await layer.value.animate([{opacity: 1}, {opacity: 0}], {duration: 220, easing: EASE, fill: "forwards"}).finished;
    done();
}

function all() {
    done();
    location.hash = `#/${route.value.env}/report?sub=updates`;
}

const onKey = (e) => e.key === "Escape" && !route.value.open && shrink();
onMounted(() => {
    window.addEventListener("keydown", onKey);
    grow();
});
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
    <section ref="layer" class="update-layer" aria-label="Update report">
        <div ref="ghost" class="update-ghost" />
        <div ref="scroller" class="update-scroll">
            <template v-if="report">
                <ResourceBody :resource="report" :comments="false" :links="false" @close="shrink">
                    <template #tools>
                        <button type="button" class="to-panel" title="Open in the side panel" @click="toPanel">
                            <Icon name="sidepanel" />
                        </button>
                    </template>
                    <UpdateReport :resource="report" @step="step" @all="all" />
                </ResourceBody>
            </template>
        </div>
    </section>
</template>

<style scoped>
.update-layer {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    background: var(--bg);
}

.update-scroll :deep(.age) {
    white-space: nowrap;
}

.to-panel {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.to-panel:hover {
    background: var(--hover);
    color: var(--text);
}

.update-ghost {
    position: absolute;
    pointer-events: none;
}

.update-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0 16px 32px;
}

@media (max-width: 760px) {
    .update-scroll {
        padding: 0 0 24px;
    }
}
</style>
