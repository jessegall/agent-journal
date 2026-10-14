<script setup>
import {onBeforeUpdate, onUpdated, ref} from "vue";
import SkeletonLine from "../kit/SkeletonLine.vue";
import TextDisplay from "../kit/TextDisplay.vue";

defineProps({sections: Array, document: Boolean, writing: {type: String, default: ""}});
const root = ref(null);
const BLOCKS = "h3, p, li, pre, blockquote, table";
const FADE_FOR = 2600;
const PLACEHOLDER = /^being written\.?$/i;
const pending = (section) => PLACEHOLDER.test((section.body || "").trim());
const WIDTHS = ["97%", "91%", "94%", "86%", "62%", "48%"];
const barsFor = (title) => {
    const seed = [...title].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    return [0, 1, 2, 3].map((i) => ({width: WIDTHS[(seed + i * 5) % (i === 3 ? 6 : 4)], height: 9}));
};
let before = new Set();
const blocks = () => [...(root.value?.querySelectorAll(BLOCKS) || [])];

onBeforeUpdate(() => (before = new Set(blocks().map((el) => el.textContent))));
onUpdated(() => {
    for (const el of blocks().filter((el) => !before.has(el.textContent))) {
        el.classList.add("fresh");
        setTimeout(() => el.classList.remove("fresh"), FADE_FOR);
    }
});
</script>

<template>
    <div ref="root" class="sections">
        <template v-for="s in sections" :key="s.title">
            <section :class="['section', {reading: document, writing: writing && writing === s.title}]">
                <h3>{{ s.title }}</h3>
                <Transition name="written" mode="out-in">
                    <template v-if="pending(s)">
                        <SkeletonLine class="being-written" :bars="barsFor(s.title)" role="img" aria-label="Being written">
                            <span class="being-written-room" />
                        </SkeletonLine>
                    </template>
                    <template v-else>
                        <TextDisplay :text="s.body" />
                    </template>
                </Transition>
            </section>
        </template>
    </div>
</template>

<style scoped>
.section {
    margin-top: 16px;
}

h3 {
    margin: 0 0 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
}

.section.reading {
    margin-top: 28px;
    scroll-margin-top: 120px;
}

.section.reading h3 {
    margin-bottom: 8px;
    font-size: 15px;
    letter-spacing: -0.005em;
}

.sections :deep(.fresh) {
    animation: arrive 2.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes arrive {
    0% {
        opacity: 0;
        filter: blur(3px);
        transform: translateY(4px);
        background-color: color-mix(in srgb, var(--accent) 16%, transparent);
    }

    25% {
        opacity: 1;
        filter: none;
        transform: none;
    }

    100% {
        background-color: transparent;
    }
}

.section.writing :deep(.md > :last-child)::after {
    content: "";
    display: inline-block;
    width: 2px;
    height: 1.05em;
    margin-left: 3px;
    vertical-align: -0.15em;
    border-radius: 1px;
    background: var(--accent-text);
    animation: caret 1.1s steps(1) infinite;
}

@keyframes caret {
    50% {
        opacity: 0;
    }
}

.being-written {
    margin: 6px 0 4px;
}

.being-written-room {
    display: block;
    height: 76px;
}

.written-leave-active {
    transition: opacity 0.22s ease;
}

.written-leave-to {
    opacity: 0;
}

.written-enter-active {
    transition:
        opacity 0.5s ease,
        filter 0.5s ease,
        transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.written-enter-from {
    opacity: 0;
    filter: blur(3px);
    transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
    .written-enter-active,
    .written-leave-active {
        transition: none;
    }

    .sections :deep(.fresh),
    .section.writing :deep(.md > :last-child)::after {
        animation: none;
    }
}
</style>
