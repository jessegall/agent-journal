<script setup>
import MoreButton from "./MoreButton.vue";
import SwipeRow from "./SwipeRow.vue";

defineProps({
    title: {type: String, required: true},
    about: {type: String, required: true},
    meta: {type: Array, default: () => []},
    state: {type: String, default: ""},
    lead: {type: Object, default: null},
    trail: {type: Array, default: () => []},
});
const emit = defineEmits(["open", "more"]);
</script>

<template>
    <SwipeRow :label="title" :lead="lead" :trail="trail" @open="emit('open')" @hold="emit('more')">
        <div class="item-row">
            <span :class="['item-dot', state]" aria-hidden="true" />
            <span class="item-main">
                <span class="item-title">{{ title }}</span>
                <template v-if="meta.length">
                    <span class="item-meta">
                        <template v-for="bit in meta" :key="bit">
                            <span>{{ bit }}</span>
                        </template>
                    </span>
                </template>
            </span>
            <MoreButton :about="about" @more="emit('more')" />
        </div>
    </SwipeRow>
</template>

<style scoped>
.item-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    padding: 10px 14px;
}

.item-dot {
    flex: none;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--border-2);
}

.item-dot.waiting,
.item-dot.blocked {
    background: var(--tone-warn);
}

.item-dot.doing,
.item-dot.working {
    background: var(--accent);
}

.item-dot.done {
    background: var(--tone-good);
}

.item-main {
    flex: 1;
    min-width: 0;
}

.item-title {
    display: block;
    font-size: 1.0625rem;
    line-height: 1.3;
}

.item-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    margin-top: 2px;
    color: var(--text-3);
    font-size: 0.8125rem;
}
</style>
