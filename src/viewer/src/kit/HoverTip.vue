<script setup>
// the one tooltip look: it opens on hover or focus under the element it belongs to, which the parent positions
defineProps({as: {type: String, default: "span"}, place: {type: String, default: "left"}});
</script>

<template>
    <component :is="as" :type="as === 'button' ? 'button' : undefined" class="tipped">
        <slot />
        <span :class="['tip', place]" role="tooltip"><slot name="tip" /></span>
    </component>
</template>

<style scoped>
.tip {
    position: absolute;
    z-index: 5;
    display: none;
    width: max-content;
    max-width: 280px;
    padding: 7px 10px;
    border: 1px solid var(--border-3);
    border-radius: 8px;
    background: var(--raised);
    box-shadow: 0 8px 22px rgba(0, 0, 0, .35);
    color: var(--text);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.45;
    text-align: left;
    white-space: normal;
    pointer-events: none;
}

.tip.left { top: 22px; left: 0; }
.tip.right { top: 22px; right: 0; }
.tip.corner { top: 26px; right: -2px; }
.tipped:hover .tip, .tipped:focus-visible .tip { display: block; }
.tipped:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; border-radius: 4px; }
</style>
