<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import Icon from "../kit/Icon.vue";
import {firstTime} from "./once.js";
import {plain} from "./plain.js";
import {useTrap} from "./trap.js";

const FACES = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩"];
const MARGIN = 12;
const TOP = 56;
const props = defineProps({item: {type: Object, required: true}, rect: {type: Object, default: null}});
const emit = defineEmits(["react", "reply", "copy", "close"]);
const box = ref(null);
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

onMounted(() => {
    const wanted = props.rect ? props.rect.top - 60 : window.innerHeight / 3;
    top.value = wanted;
    nextTick(() => {
        const tall = box.value?.offsetHeight || 0;
        top.value = Math.max(TOP, Math.min(wanted, window.innerHeight - tall - MARGIN * 3));
    });
});
</script>

<template>
    <div class="hold-root">
        <button type="button" class="hold-backdrop" aria-label="Close" tabindex="-1" @click="emit('close')" />
        <div ref="box" :class="['hold-box', {mine}]" role="dialog" aria-modal="true" aria-label="Message actions" tabindex="-1" :style="{top: `${top}px`, ...side}">
            <p :class="['hold-preview', {mine}]" :style="{width}">{{ plain(item.brief || item.title) }}</p>
            <div class="hold-faces" role="group" aria-label="React">
                <template v-for="face in FACES" :key="face">
                    <button type="button" class="hold-face" :aria-label="`React ${face}`" @click="emit('react', face)">{{ face }}</button>
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
            </ul>
            <button type="button" class="hold-close" @click="emit('close')">Close</button>
            <template v-if="hint">
                <p class="hold-hint">Tip: swipe a message to the right to reply.</p>
            </template>
        </div>
    </div>
</template>

<style scoped>
.hold-root {
    position: fixed;
    inset: 0;
    height: var(--app-height, auto);
    z-index: 20;
    max-width: none;
}

.hold-backdrop {
    position: absolute;
    inset: 0;
    max-width: none;
    padding: 0;
    border: 0;
    background: var(--scrim);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    animation: hold-fade 200ms linear;
}

.hold-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
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
    display: flex;
    gap: 2px;
    max-width: min(340px, calc(100vw - 24px));
    padding: 4px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    border-radius: 26px;
    background: var(--raised);
    box-shadow: var(--shadow-1);
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
}

.hold-faces::-webkit-scrollbar {
    display: none;
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
    background: var(--accent-dim);
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

.hold-hint {
    max-width: 240px;
    margin: 0;
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
