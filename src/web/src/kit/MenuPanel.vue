<script setup>
import {computed, onMounted, ref} from "vue";

const props = defineProps({anchor: {type: Object, default: null}, align: {type: String, default: "right"}});
const panel = ref(null);
const place = computed(() => {
    if (!props.anchor) return {};
    const edge = props.anchor.getBoundingClientRect();
    const top = `${edge.bottom + 4}px`;
    if (props.align === "left") return {top, left: `${edge.left}px`};
    return {top, right: `${window.innerWidth - edge.right}px`};
});
const emit = defineEmits(["close"]);
const items = () => [...panel.value.querySelectorAll("button:not(:disabled)")];

function step(by) {
    const all = items();
    const at = all.indexOf(document.activeElement);
    all[(at + by + all.length) % all.length].focus();
}

const KEYS = {ArrowDown: () => step(1), ArrowUp: () => step(-1), Escape: () => emit("close")};
const onKey = (e) => KEYS[e.key] && (e.preventDefault(), KEYS[e.key]());
onMounted(() => items()[0] && items()[0].focus());
defineExpose({element: panel});
</script>

<template>
    <Teleport to="body" :disabled="!anchor">
        <div ref="panel" :class="['menu-panel', {anchored: anchor}]" :style="place" @keydown="onKey"><slot /></div>
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
