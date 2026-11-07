<script setup>
import {computed, inject, nextTick, ref, watch} from "vue";
import Icon from "../src/kit/Icon.vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";

// a list that stays at the end its window declares as rows arrive: scrolling away stops that and shows a Newest button, and the button or
// reaching that end again starts it
const EDGE_PIXELS = 40;
const TOP = "top";
// `feed` is the window's FeedPaginator: it reads the page before the oldest when the top is reached, and checks the pane opened at the bottom
const props = defineProps({rowCount: {type: Number, default: 0}, paneClass: {type: String, default: ""}, feed: {type: Object, default: null}});
const direction = inject(WINDOW_CONTEXT, null)?.autoScroll;
const followsTop = computed(() => direction === TOP);
const pane = ref(null);
const paused = ref(false);
const edgeDistance = (box) => (followsTop.value ? box.scrollTop : box.scrollHeight - box.scrollTop - box.clientHeight);
const edgeTop = () => (followsTop.value ? 0 : pane.value.scrollHeight);
const scrollToEdge = () => pane.value.scrollTo({top: edgeTop(), behavior: "smooth"});

function followScroll() {
    paused.value = edgeDistance(pane.value) >= EDGE_PIXELS;
    if (!followsTop.value) props.feed?.reachTop(pane.value);
}

// the pane goes to its edge as rows arrive and once the feed has loaded, which can draw more than the rows alone did
watch(() => [props.rowCount, props.feed?.isLoaded()], async () => {
    await nextTick();
    if (!pane.value) return;
    if (!paused.value) pane.value.scrollTop = edgeTop();
    if (props.feed && !followsTop.value) {
        props.feed.drawn(pane.value);
        await props.feed.fill(pane.value);
    }
}, {immediate: true, flush: "post"});

defineExpose({pane});
</script>

<template>
    <div class="auto-scroll" data-auto-scroll>
        <div ref="pane" :class="['auto-scroll-pane', paneClass]" @scroll="followScroll">
            <slot />
        </div>
        <Transition name="auto-scroll-rise">
            <button v-show="paused" type="button" class="auto-scroll-newest" data-scroll-newest title="Back to the newest" @click="scrollToEdge">
                <Icon :name="followsTop ? 'up' : 'down'" />
                Newest
            </button>
        </Transition>
    </div>
</template>

<style scoped>
.auto-scroll {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.auto-scroll-pane {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.auto-scroll-newest {
    position: absolute;
    z-index: 3;
    bottom: 6px;
    left: 50%;
    display: inline-flex;
    gap: 5px;
    align-items: center;
    padding: 4px 11px;
    border: 1px solid var(--text);
    border-radius: 99px;
    background: var(--text);
    color: var(--bg);
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
    transform: translateX(-50%);
}

.auto-scroll-newest:hover {
    border-color: var(--text-2);
    background: var(--text-2);
}

.auto-scroll-rise-enter-active,
.auto-scroll-rise-leave-active {
    transition: opacity 0.18s ease-out;
}

.auto-scroll-rise-enter-from,
.auto-scroll-rise-leave-to {
    opacity: 0;
}
</style>
