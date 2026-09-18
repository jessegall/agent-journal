<script setup>
import {computed} from "vue";

const props = defineProps({value: {type: Number, default: 100}});
const bars = computed(() => (props.value < 100 ? [1, 0.25, 0.25] : props.value === 100 ? [1, 1, 0.25] : [1, 1, 1]));
</script>

<template>
    <svg
        :class="['ico', 'prio', {hot: value >= 200}]"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        :aria-label="`priority ${value}`"
    >
        <path d="M4.5 13l3.5-2.25L11.5 13" :style="{opacity: bars[0]}" />
        <path d="M4.5 9.25L8 7l3.5 2.25" :style="{opacity: bars[1]}" />
        <path d="M4.5 5.5L8 3.25l3.5 2.25" :style="{opacity: bars[2]}" />
    </svg>
</template>

<style scoped>
.prio {
    flex: none;
    width: 14px;
    height: 14px;
    color: var(--text-3);
}

.prio.hot {
    color: #d98c8c;
}
</style>
