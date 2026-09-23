<script setup>
import {computed, onMounted, ref} from "vue";

defineOptions({inheritAttrs: false});
const props = defineProps({
    anchor: {type: Object, default: null},
    align: {type: String, default: "right"},
    minWidth: {type: Number, default: 0},
    maxWidth: {type: Number, default: 0},
    maxHeight: {type: Number, default: 0},
});
const panel = ref(null);
const px = (value) => (value ? `${value}px` : undefined);
const size = computed(() => ({minWidth: px(props.minWidth), maxWidth: px(props.maxWidth), maxHeight: px(props.maxHeight)}));
const place = computed(() => {
    if (!props.anchor) return size.value;
    const edge = props.anchor.getBoundingClientRect();
    const top = `${edge.bottom + 4}px`;
    if (props.align === "left") return {...size.value, top, left: `${edge.left}px`};
    return {...size.value, top, right: `${window.innerWidth - edge.right}px`};
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
        <div ref="panel" v-bind="$attrs" :class="['menu-panel', {anchored: anchor}]" :style="place" @keydown="onKey"><slot /></div>
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
    overflow-y: auto;
}

.menu-panel:not(.anchored) {
    top: calc(100% + 4px);
    left: 0;
}

.menu-panel.anchored {
    position: fixed;
}
</style>
