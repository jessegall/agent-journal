<script setup>
import Shimmer from "./Shimmer.vue";
import SwitchCase from "./SwitchCase.vue";

// the parts a window's skeleton is declared from, drawn one inside the other: shimmer only, never a border
defineOptions({name: "SkeletonParts"});
defineProps({parts: {type: Array, default: () => []}});

const LINE_HEIGHTS = {small: 9, medium: 11, large: 15};
const CIRCLE_SIZES = {small: 16, medium: 24, large: 40};
const held = (part) => ({gap: `${part.spacing}px`, padding: part.padding || undefined});
const tiled = (part) => ({...held(part), gridTemplateColumns: `repeat(auto-fill, minmax(min(${part.width}, 100%), 1fr))`});
</script>

<template>
    <template v-for="(part, index) in parts" :key="index">
        <template v-for="copy in part.count" :key="copy">
            <SwitchCase :value="part.shape">
                <template #line>
                    <Shimmer class="shimmer-line" data-skeleton-line :style="{width: part.width, height: `${LINE_HEIGHTS[part.size]}px`}" />
                </template>
                <template #circle>
                    <Shimmer class="shimmer-circle" data-skeleton-circle :style="{width: `${CIRCLE_SIZES[part.size]}px`, height: `${CIRCLE_SIZES[part.size]}px`}" />
                </template>
                <template #block>
                    <Shimmer class="shimmer-block" data-skeleton-block :style="{width: part.width, height: `${part.height}px`}" />
                </template>
                <template #grow>
                    <span class="skeleton-grow" />
                </template>
                <template #row>
                    <div class="skeleton-row" :style="held(part)"><SkeletonParts :parts="part.parts" /></div>
                </template>
                <template #stack>
                    <div class="skeleton-stack" :style="held(part)"><SkeletonParts :parts="part.parts" /></div>
                </template>
                <template #card>
                    <div class="skeleton-stack skeleton-card" data-skeleton-card :style="held(part)"><SkeletonParts :parts="part.parts" /></div>
                </template>
                <template #grid>
                    <div class="skeleton-grid" :style="tiled(part)"><SkeletonParts :parts="part.parts" /></div>
                </template>
            </SwitchCase>
        </template>
    </template>
</template>

<style scoped>
.shimmer-line {
    border-radius: 6px;
}

.shimmer-circle {
    border-radius: 50%;
}

.shimmer-block {
    border-radius: 9px;
}

.skeleton-grow {
    flex: 1;
}

.skeleton-row {
    display: flex;
    align-items: center;
    min-width: 0;
}

.skeleton-row > .shimmer-line {
    flex: 0 1 auto;
}

.skeleton-stack {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.skeleton-card {
    border-radius: 12px;
    background: color-mix(in srgb, var(--raised) 45%, transparent);
}

.skeleton-grid {
    display: grid;
    align-items: start;
}
</style>
