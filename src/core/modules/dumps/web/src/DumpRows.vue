<script setup>
import {computed} from "vue";
import {Skeleton, useRows} from "@journal/window-kit";

// dumps as version 4 drew them: a card for each with its title and brief, its items each with where the agent has got to
// (new, noted, filed, failed), the note or summary the agent left, and what it filed the item into
const dumps = useRows("dump list", ["dump.*", "dump_item.*"]);
const items = useRows("dump-item list", ["dump_item.*"]);
const STATES = {new: "New", noted: "Noted", filed: "Filed", failed: "Failed"};
const cards = computed(() => dumps.rows.value.map((dump) => ({dump, items: items.rows.value.filter((item) => item.dump_id === dump.id).sort((a, b) => a.position - b.position)})));
const loaded = computed(() => dumps.loaded.value && items.loaded.value);
</script>

<template>
    <div class="dumps">
        <template v-if="!loaded">
            <Skeleton shape="cards" />
        </template>
        <template v-else-if="dumps.failure.value">
            <p class="dumps-note">{{ dumps.failure.value }}</p>
        </template>
        <template v-else-if="!cards.length">
            <p class="dumps-note">No dumps</p>
        </template>
        <template v-for="card in cards" :key="card.dump.id">
            <section class="dump" :data-dump="card.dump.id">
                <h3 class="dump-title">{{ card.dump.title || `Dump ${card.dump.id}` }}</h3>
                <p class="dump-brief">{{ card.dump.outcome ? `Closed: ${card.dump.outcome}` : card.dump.brief }}</p>
                <template v-for="item in card.items" :key="item.id">
                    <div class="item" :data-item="item.id" :data-state="item.state">
                        <span :class="['item-state', item.state]">{{ STATES[item.state] || item.state }}</span>
                        <span class="item-text">{{ item.text }}</span>
                        <template v-if="item.summary || item.note">
                            <span class="item-note">{{ item.summary || item.note }}</span>
                        </template>
                        <template v-if="item.refs.length">
                            <span class="item-refs">Filed into {{ item.refs.join(", ") }}</span>
                        </template>
                    </div>
                </template>
            </section>
        </template>
    </div>
</template>

<style scoped>
.dumps {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.dump {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
}

.dump-title {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
}

.dump-brief,
.dumps-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.item {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 2px 10px;
    padding: 6px 0;
    border-top: 1px solid var(--border);
}

.item-state {
    grid-row: span 3;
    align-self: start;
    color: var(--text-3);
    font-size: 12px;
}

.item-state.filed {
    color: var(--accent-text);
}

.item-state.failed {
    color: var(--danger);
}

.item-note,
.item-refs {
    color: var(--text-3);
    font-size: 12px;
}
</style>
