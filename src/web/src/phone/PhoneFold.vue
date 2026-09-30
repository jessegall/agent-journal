<script setup>
import {onMounted, onUnmounted, ref} from "vue";

const props = defineProps({lines: {type: Number, default: 8}});
const inner = ref(null);
const tall = ref(false);
const open = ref(false);
const full = ref(0);

function toggled() {
    full.value = inner.value?.scrollHeight || 0;
    open.value = !open.value;
}
const SLACK = 1.5;
let watcher = null;

function measure() {
    const el = inner.value;
    if (!el) return;
    const line = parseFloat(getComputedStyle(el).lineHeight) || 22;
    tall.value = el.scrollHeight > line * (props.lines + SLACK);
    full.value = el.scrollHeight;
}

onMounted(() => {
    measure();
    watcher = new ResizeObserver(measure);
    if (inner.value) watcher.observe(inner.value);
});

onUnmounted(() => watcher?.disconnect());
</script>

<template>
    <div class="fold">
        <div :class="['fold-box', {folded: tall && !open, opened: tall && open}]" :style="{'--lines': lines, '--full': `${full}px`}">
            <div ref="inner" class="fold-inner"><slot /></div>
        </div>
        <template v-if="tall">
            <button type="button" class="fold-toggle" :aria-expanded="open" @click.stop="toggled">{{ open ? "Show less" : "Read more" }}</button>
        </template>
    </div>
</template>

<style scoped>
.fold-box {
    transition: max-height 200ms ease-out;
}

.fold-box.opened {
    max-height: var(--full);
    overflow: hidden;
}

.fold-box.folded {
    max-height: calc(var(--lines) * 1.35em);
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 2.4em), transparent);
    mask-image: linear-gradient(to bottom, #000 calc(100% - 2.4em), transparent);
}

.fold-toggle {
    min-height: 32px;
    margin-top: 2px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-weight: 600;
}
</style>
