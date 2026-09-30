<script setup>
defineProps({size: {type: Number, default: 14}, facing: {type: String, default: "right"}});
const TURNS = {right: 0, down: 90, left: 180, up: 270};
</script>

<template>
    <svg
        class="ico chevron"
        :width="size"
        :height="size"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        :style="{transform: `rotate(${TURNS[facing]}deg)`}"
    >
        <path d="M6 3 11 8 6 13" />
    </svg>
</template>
