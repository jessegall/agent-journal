<script setup>
import {onMounted, onUnmounted, ref} from "vue";

const props = defineProps({at: {type: Number, default: 420}, keep: {type: Number, default: 320}});
const body = ref(null);
const tall = ref(false);
const open = ref(false);
const measure = () => {
    const is = !!body.value && body.value.scrollHeight > props.at;
    if (is !== tall.value) tall.value = is;
};
const watcher = new ResizeObserver(() => requestAnimationFrame(measure));

onMounted(() => body.value && watcher.observe(body.value.firstElementChild || body.value));
onUnmounted(() => watcher.disconnect());
</script>

<template>
    <div ref="body" :class="['folded-body', {folded: tall && !open}]" :style="tall && !open ? {maxHeight: `${keep}px`} : {}">
        <slot />
    </div>
    <template v-if="tall">
        <button type="button" class="fold" @click.stop="open = !open">{{ open ? "Show less" : "Show more" }}</button>
    </template>
</template>

<style scoped>
.folded-body.folded {
    overflow: hidden;
    mask-image: linear-gradient(to bottom, #000 75%, transparent);
}

.fold {
    margin-top: 4px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.fold:hover {
    text-decoration: underline;
}
</style>
