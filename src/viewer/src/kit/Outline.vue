<script setup>
import {computed} from "vue";

const props = defineProps({rect: {type: Object, required: true}, tag: {type: String, default: ""}});

const NEAR_TOP = 40;

const ring = computed(() => ({
    left: `${props.rect.l - 4}px`,
    top: `${props.rect.t - 4}px`,
    width: `${props.rect.r - props.rect.l + 8}px`,
    height: `${props.rect.b - props.rect.t + 8}px`,
}));
</script>

<template>
    <Teleport to="body">
        <div :class="['outline', {tagged: tag, below: rect.t < NEAR_TOP}]" :style="ring">
            <template v-if="tag">
                <span class="outline-tag">{{ tag }}</span>
            </template>
        </div>
    </Teleport>
</template>

<style scoped>
.outline {
    position: fixed;
    z-index: 500;
    border: 1.5px solid var(--accent);
    border-radius: 8px;
    pointer-events: none;
    animation: outline-in 0.2s both;
    transition:
        left 0.3s var(--ease),
        top 0.3s var(--ease),
        width 0.3s var(--ease),
        height 0.3s var(--ease);
}

.outline.tagged {
    border-width: 3px;
    box-shadow:
        0 0 0 4px var(--accent-dim),
        0 0 18px var(--accent);
    animation:
        outline-in 0.2s both,
        outline-pulse 0.9s 0.2s 1;
}

.outline-tag {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 6px);
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.5;
    white-space: nowrap;
    transform: translateX(-50%);
}

.outline.below .outline-tag {
    bottom: auto;
    top: calc(100% + 6px);
}

@keyframes outline-pulse {
    50% {
        transform: scale(1.04);
    }
}

@keyframes outline-in {
    from {
        opacity: 0;
    }
}
</style>
