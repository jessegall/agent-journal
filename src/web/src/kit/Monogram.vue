<script setup>
defineProps({
    text: {type: String, required: true},
    tint: {type: String, default: ""},
    size: {type: Number, default: 32},
});
</script>

<template>
    <span class="monogram" :style="{'--tint': tint || 'var(--text-4)', '--size': `${size}px`}" aria-hidden="true">
        {{ text.slice(0, 1).toUpperCase() }}
    </span>
</template>

<style scoped>
.monogram {
    flex: none;
    display: grid;
    place-items: center;
    width: var(--size);
    height: var(--size);
    border-radius: calc(var(--size) / 4);
    background: color-mix(in srgb, var(--tint) 18%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tint) 34%, transparent);
    color: color-mix(in srgb, var(--tint) 62%, var(--text));
    font-size: calc(var(--size) * 0.44);
    font-weight: 600;
    line-height: 1;
}
</style>
