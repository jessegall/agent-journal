<script setup>
import {computed, ref} from "vue";

const props = defineProps({anchor: {type: Object, default: null}});
const panel = ref(null);
const place = computed(() => {
    if (!props.anchor) return {};
    const edge = props.anchor.getBoundingClientRect();
    return {top: `${edge.bottom + 4}px`, right: `${window.innerWidth - edge.right}px`};
});
defineExpose({element: panel});
</script>

<template>
    <Teleport to="body" :disabled="!anchor">
        <div ref="panel" :class="['menu-panel', {anchored: anchor}]" :style="place"><slot /></div>
    </Teleport>
</template>

<style scoped>
.menu-panel {
    position: absolute;
    z-index: 40;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
}

.menu-panel.anchored {
    position: fixed;
}
</style>
