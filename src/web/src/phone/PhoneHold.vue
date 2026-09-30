<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";
import Icon from "../kit/Icon.vue";
import {firstTime} from "./once.js";
import {plain} from "./plain.js";
import {useTrap} from "./trap.js";

const FACES = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩"];
const MARGIN = 12;
const LOW = 0.3;
const TOP = 56;
const props = defineProps({item: {type: Object, required: true}, rect: {type: Object, default: null}, source: {type: Object, default: null}});
const preview = ref(null);

function cloned() {
    if (!props.source || !preview.value) return;
    const copy = props.source.cloneNode(true);
    copy.removeAttribute("data-hold");
    delete copy.dataset.pressing;
    delete copy.dataset.dragging;
    copy.style.transform = "";
    copy.style.maxWidth = "100%";
    copy.style.margin = "0";
    copy.inert = true;
    copy.setAttribute("aria-hidden", "true");
    preview.value.replaceChildren(copy);
}
const emit = defineEmits(["react", "reply", "copy", "close"]);
const box = ref(null);
const FACE = 46;
const ROW_PAD = 8;
const moreFaces = ref(false);
const fits = computed(() => Math.max(1, Math.floor((Math.min(340, window.innerWidth - 24) - ROW_PAD - FACE) / FACE)));
const shownFaces = computed(() => (moreFaces.value || fits.value >= FACES.length ? FACES : FACES.slice(0, fits.value)));
const top = ref(0);
const mine = computed(() => props.item.who === "user");
const hint = firstTime("phone-reply-hint");
const side = computed(() => {
    const rect = props.rect;
    if (!rect) return {left: `${MARGIN}px`, right: `${MARGIN}px`};
    return mine.value ? {right: `${Math.max(MARGIN, window.innerWidth - rect.right)}px`} : {left: `${Math.max(MARGIN, rect.left)}px`};
});
const width = computed(() => (props.rect ? `${Math.min(props.rect.width, window.innerWidth - 2 * MARGIN)}px` : "auto"));

useTrap(box, () => emit("close"));

let watcher = null;

function placed() {
    const wanted = Math.max(props.rect ? props.rect.top - 60 : 0, window.innerHeight * LOW);
    const tall = box.value?.offsetHeight || 0;
    top.value = Math.max(TOP, Math.min(wanted, window.innerHeight - tall - MARGIN * 3));
}

const closed = () => emit("close");

onMounted(() => {
    cloned();
    if (props.source) props.source.style.visibility = "hidden";
    window.addEventListener("resize", closed);
    window.addEventListener("orientationchange", closed);
    placed();
    nextTick(() => {
        placed();
        watcher = new ResizeObserver(placed);
        if (box.value) watcher.observe(box.value);
    });
});

onUnmounted(() => {
    watcher?.disconnect();
    if (props.source) props.source.style.visibility = "";
    window.removeEventListener("resize", closed);
    window.removeEventListener("orientationchange", closed);
});
</script>

<template>
    <div class="hold-root">
        <button type="button" class="hold-backdrop" aria-hidden="true" tabindex="-1" @click="emit('close')" />
        <div ref="box" :class="['hold-box', {mine}]" role="dialog" aria-modal="true" aria-label="Message actions" tabindex="-1" :style="{top: `${top}px`, ...side}">
            <template v-if="source">
                <p class="phone-hidden">{{ plain(item.brief || item.title) }}</p>
                <div ref="preview" class="hold-clone" :style="{width}" />
            </template>
            <template v-else>
                <p :class="['hold-preview', {mine}]" :style="{width}">{{ plain(item.brief || item.title) }}</p>
            </template>
            <div :class="['hold-faces', {more: moreFaces}]" role="group" aria-label="React">
                <template v-for="face in shownFaces" :key="face">
                    <button type="button" class="hold-face" :aria-label="`React ${face}`" @click="emit('react', face)">{{ face }}</button>
                </template>
                <template v-if="shownFaces.length < FACES.length">
                    <button type="button" class="hold-face hold-more" aria-label="More reactions" @click="moreFaces = true"><Icon name="plus" :size="18" /></button>
                </template>
            </div>
            <ul class="hold-menu" aria-label="Actions">
                <li>
                    <button type="button" class="hold-action" @click="emit('reply')">
                        Reply
                        <Icon name="reply" :size="18" />
                    </button>
                </li>
                <li>
                    <button type="button" class="hold-action" @click="emit('copy')">
                        Copy
                        <Icon name="copy" :size="18" />
                    </button>
                </li>
                <template v-if="hint">
                    <li class="hold-hint">Tip: swipe a message to the right to reply.</li>
                </template>
            </ul>
            <button type="button" class="hold-close" @click="emit('close')">Close</button>
        </div>
    </div>
</template>

<style scoped>
.hold-root {
    position: absolute;
    inset: 0;
    z-index: 20;
    max-width: none;
}

.hold-backdrop {
    position: absolute;
    inset: 0;
    max-width: none;
    padding: 0;
    border: 0;
    background: var(--scrim-menu);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    animation: hold-fade 200ms linear;
}

.hold-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    max-width: calc(100% - 24px);
    outline: none;
    transform-origin: top left;
    animation: hold-in 250ms var(--push);
}

.hold-box.mine {
    align-items: flex-end;
    transform-origin: top right;
}

.hold-faces {
    order: -1;
    margin-bottom: -2px;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    max-width: min(340px, calc(100vw - 24px));
    padding: 4px;
    border-radius: 26px;
    background: var(--raised);
    box-shadow: var(--shadow-1);
}

.hold-faces.more {
    border-radius: 24px;
}

.hold-more {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-2);
}

.hold-face {
    flex: none;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    font-size: 1.5rem;
}

.hold-face:active {
    background: var(--hover);
}

.hold-preview {
    display: -webkit-box;
    margin: 0;
    padding: 8px 12px;
    overflow: hidden;
    border-radius: 18px;
    background: var(--raised);
    color: var(--text);
    font-size: 1rem;
    line-height: 1.35;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
}

.hold-preview.mine {
    background: var(--accent);
    color: #fff;
}

.hold-menu {
    width: 240px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--raised);
    box-shadow: var(--shadow-1);
    list-style: none;
}

.hold-menu li + li {
    border-top: 1px solid var(--line);
}

.hold-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 44px;
    padding: 10px 16px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 1rem;
    text-align: left;
}

.hold-action:active {
    background: var(--hover);
    opacity: 1;
}

.hold-close {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    border: 0;
}

.hold-close:focus-visible {
    position: static;
    width: 240px;
    height: auto;
    min-height: 44px;
    clip: auto;
    border-radius: 12px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-weight: 600;
}

.hold-clone {
    max-height: 38vh;
    overflow: hidden;
    border-radius: 18px;
    box-shadow: var(--shadow-1);
}

.hold-hint {
    padding: 10px 16px;
    color: var(--text-2);
    font-size: 0.765rem;
}

@keyframes hold-in {
    from {
        opacity: 0;
        transform: scale(0.92);
    }
}

@keyframes hold-fade {
    from {
        opacity: 0;
    }
}
</style>
