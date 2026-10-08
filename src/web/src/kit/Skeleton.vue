<script setup>
import SkeletonLine from "./SkeletonLine.vue";
import SwitchCase from "./SwitchCase.vue";

defineProps({shape: {type: String, default: "rows"}, count: {type: Number, default: 4}, label: {type: String, default: "Loading"}});

const MESSAGES = [
    {id: "shape-1", width: 46, height: 38, mine: false},
    {id: "shape-2", width: 30, height: 22, mine: true},
    {id: "shape-3", width: 58, height: 64, mine: false},
    {id: "shape-4", width: 40, height: 30, mine: false},
    {id: "shape-5", width: 34, height: 22, mine: true},
    {id: "shape-6", width: 62, height: 86, mine: false},
    {id: "shape-7", width: 26, height: 22, mine: false},
    {id: "shape-8", width: 50, height: 44, mine: true},
    {id: "shape-9", width: 38, height: 30, mine: false},
    {id: "shape-10", width: 56, height: 58, mine: false},
    {id: "shape-11", width: 30, height: 22, mine: true},
    {id: "shape-12", width: 44, height: 38, mine: false},
    {id: "shape-13", width: 60, height: 72, mine: false},
    {id: "shape-14", width: 36, height: 30, mine: true},
];
const CARD = [
    {id: "kind", bars: [{width: "64px", height: 8}]},
    {id: "title", bars: [{width: "70%", height: 12}]},
    {id: "line", bars: [{width: "45%", height: 9}]},
];
const ROW = [
    {width: "58%", height: 11},
    {width: "32%", height: 9},
];
const TEXT = ["94%", "88%", "91%", "62%"].map((width) => ({width, height: 10}));
const HEADING = [
    {width: "110px", height: 12},
    {width: "86%", height: 24},
    {width: "52%", height: 24},
];
</script>

<template>
    <SwitchCase :value="shape">
        <template #messages>
            <div class="skeleton-messages" aria-busy="true" :aria-label="label">
                <template v-for="message in MESSAGES" :key="message.id">
                    <div
                        :class="['skeleton-message', {mine: message.mine}]"
                        :style="{width: `${message.width}%`, height: `${message.height}px`}"
                    />
                </template>
            </div>
        </template>
        <template #cards>
            <div class="skeleton-cards" aria-busy="true" :aria-label="label">
                <template v-for="index in count" :key="index">
                    <div class="skeleton-card">
                        <template v-for="line in CARD" :key="line.id">
                            <SkeletonLine :bars="line.bars" />
                        </template>
                    </div>
                </template>
            </div>
        </template>
        <template #page>
            <div class="skeleton-text" aria-busy="true" :aria-label="label">
                <SkeletonLine class="skeleton-heading" :bars="HEADING" />
                <template v-for="index in count" :key="index">
                    <SkeletonLine :bars="TEXT" />
                </template>
            </div>
        </template>
        <template #text>
            <div class="skeleton-text" aria-busy="true" :aria-label="label">
                <template v-for="index in count" :key="index">
                    <SkeletonLine :bars="TEXT" />
                </template>
            </div>
        </template>
        <template #default>
            <div class="skeleton-rows" aria-busy="true" :aria-label="label">
                <template v-for="index in count" :key="index">
                    <SkeletonLine class="skeleton-row" :bars="ROW" />
                </template>
            </div>
        </template>
    </SwitchCase>
</template>

<style scoped>
.skeleton-messages {
    order: 1;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 8px 12px;
    overflow: hidden;
}

.skeleton-message {
    flex: none;
    border-radius: 9px;
    background-color: color-mix(in srgb, var(--raised) 60%, transparent);
    background-image: linear-gradient(100deg, transparent 35%, color-mix(in srgb, var(--text-3) 22%, transparent) 50%, transparent 65%);
    background-size: 200vw 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    animation: skeleton-shimmer 1.6s linear infinite;
}

.skeleton-message.mine {
    align-self: flex-end;
}

.skeleton-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.skeleton-card {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.skeleton-rows {
    display: flex;
    flex-direction: column;
}

.skeleton-row {
    height: 44px;
    padding: 6px 12px;
    box-sizing: border-box;
}

.skeleton-text {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 4px 0;
}

.skeleton-text > * {
    height: 64px;
}

.skeleton-text > .skeleton-heading {
    height: 84px;
}

@keyframes skeleton-shimmer {
    from {
        background-position: -100vw 0;
    }

    to {
        background-position: 100vw 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .skeleton-message {
        animation: none;
    }
}
</style>
