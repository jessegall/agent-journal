<script setup>
import PhoneNavRow from "./PhoneNavRow.vue";
import {ago} from "../format/time.js";
import PhoneSkeletonRows from "./PhoneSkeletonRows.vue";

defineProps({
    loaded: {type: Boolean, required: true},
    rows: {type: Array, required: true},
    shown: {type: Array, required: true},
    total: {type: Number, required: true},
    fresh: {type: Array, default: () => []},
    mark: {type: String, default: "New"},
});
const emit = defineEmits(["open", "more"]);
</script>

<template>
    <div class="board-group">
        <template v-if="!loaded">
            <PhoneSkeletonRows :count="3" />
        </template>
        <template v-else-if="rows.length">
            <ul class="board-rows">
                <template v-for="row in shown" :key="row.ref">
                    <li>
                        <PhoneNavRow class="board-row" @click="emit('open', row.ref)">
                            <span class="board-title">{{ row.title }}</span>
                            <template v-if="fresh.includes(row.ref)">
                                <span class="board-new">{{ mark }}</span>
                            </template>
                            <span class="board-age">{{ ago(row.updated) }}</span>
                        </PhoneNavRow>
                    </li>
                </template>
            </ul>
            <template v-if="rows.length > shown.length">
                <button type="button" class="board-more" @click="emit('more')">
                    {{ total > rows.length ? `Show ${rows.length} of ${total}` : `Show all ${rows.length}` }}
                </button>
            </template>
            <template v-else-if="total > rows.length">
                <p class="board-part">Showing {{ rows.length }} of {{ total }}</p>
            </template>
        </template>
        <template v-else>
            <p class="board-empty">None yet</p>
        </template>
    </div>
</template>

<style scoped>
.board-group {
    overflow: hidden;
    border-radius: 12px;
    background: var(--raised);
}

.board-rows {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
}

.board-rows li + li .board-row :deep(.nav-row-chevron) {
    color: var(--text-4);
}

.board-row {
    box-shadow:
        inset 16px 1px 0 var(--raised),
        inset 0 1px 0 var(--line);
}

.board-row {
    gap: 8px;
    min-height: 44px;
    padding: 11px 16px;
}

.board-row:active:not(:disabled),
.board-more:active:not(:disabled) {
    background: var(--hover);
    opacity: 1;
}

.board-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-size: 1rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.board-new {
    flex: none;
    padding: 1px 8px;
    border-radius: 9px;
    background: var(--accent);
    color: #fff;
    font-size: 0.706rem;
    font-weight: 600;
}

.board-age {
    flex: none;
    color: var(--text-3);
    font-size: 0.882rem;
}

.board-empty {
    margin: 0;
    padding: 12px 16px;
    color: var(--text-3);
    font-size: 0.882rem;
}

.board-more {
    width: 100%;
    min-height: 44px;
    padding: 11px 16px;
    border: 0;
    border-top: 1px solid var(--line);
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 1rem;
    text-align: left;
}

.board-part {
    margin: 0;
    padding: 11px 16px;
    border-top: 1px solid var(--line);
    color: var(--text-3);
    font-size: 0.882rem;
}
</style>
