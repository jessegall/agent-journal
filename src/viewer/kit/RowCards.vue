<script setup>
import Btn from "../src/kit/Btn.vue";
import Icon from "../src/kit/Icon.vue";
import Skeleton from "../src/kit/Skeleton.vue";
import TimeAgo from "./TimeAgo.vue";

// a page of rows as cards under a count and a button that makes a new one; a card's words come from the page, and what a card opens sits in the slot
defineProps({
    rows: {type: Array, required: true},
    failure: {type: String, default: ""},
    loaded: {type: Boolean, required: true},
    term: {type: String, required: true},
    icon: {type: String, required: true},
    head: {type: Function, required: true},
    title: {type: Function, required: true},
    foot: {type: Function, required: true},
});
const emit = defineEmits(["new", "open"]);
</script>

<template>
    <div class="cards-page">
        <div class="cards-bar">
            <span class="cards-count">{{ rows.length }} {{ rows.length === 1 ? term : `${term}s` }}</span>
            <Btn small bordered v-bind="{[`data-${term}-new`]: ''}" @click="emit('new')"><Icon name="plus" :size="12" /> New {{ term }}</Btn>
        </div>
        <div class="cards">
            <template v-if="!loaded">
                <Skeleton shape="cards" />
            </template>
            <template v-else-if="failure">
                <p class="cards-note">{{ failure }}</p>
            </template>
            <template v-else-if="!rows.length">
                <p class="cards-note">No {{ term }}s yet</p>
            </template>
            <template v-for="row in rows" :key="row.id">
                <button type="button" class="card" :data-row="row.id" @click="emit('open', row)">
                    <span class="card-head"><Icon :name="icon" class="card-icon" /> {{ head(row) }}<TimeAgo class="card-age" :at="row.created_at" /></span>
                    <span class="card-title">{{ title(row) }}</span>
                    <span class="card-foot">{{ foot(row) }}</span>
                </button>
            </template>
        </div>
        <slot />
    </div>
</template>

<style scoped>
.cards-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.cards-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    padding: 8px 20px;
    border-bottom: 1px solid var(--border);
}

.cards-count {
    color: var(--text-3);
    font-size: 12px;
}

.cards {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    align-content: start;
    padding: 16px 20px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 110px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.card:hover {
    border-color: var(--border-strong, var(--border));
}

.card-head {
    display: flex;
    gap: 6px;
    align-items: center;
    color: var(--text-2);
    font-size: 13px;
}

.card-icon {
    width: 14px;
    height: 14px;
}

.card-title {
    font-weight: 600;
}

.card-foot {
    margin-top: auto;
    color: var(--text-3);
    font-size: 12px;
}

.cards-note {
    margin: 0;
    color: var(--text-2);
}

.card-age {
    margin-left: auto;
}
</style>
