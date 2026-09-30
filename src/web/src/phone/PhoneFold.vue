<script setup>
import {onMounted, onUnmounted, ref} from "vue";

const props = defineProps({lines: {type: Number, default: 8}});
const inner = ref(null);
const tall = ref(false);
const open = ref(false);
const SLACK = 1.5;
let watcher = null;

function measure() {
    const el = inner.value;
    if (!el) return;
    const line = parseFloat(getComputedStyle(el).lineHeight) || 22;
    tall.value = el.scrollHeight > line * (props.lines + SLACK);
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
        <div :class="['fold-box', {folded: tall && !open}]" :style="{'--lines': lines}">
            <div ref="inner" class="fold-inner"><slot /></div>
        </div>
        <template v-if="tall">
            <button type="button" class="fold-toggle" :aria-expanded="open" @click.stop="open = !open">{{ open ? "Show less" : "Read more" }}</button>
        </template>
    </div>
</template>

<style scoped>
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
