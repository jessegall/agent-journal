<script setup>
import {computed, watch} from "vue";
import EmptyState from "../src/kit/EmptyState.vue";
import ListRow from "../src/kit/ListRow.vue";
import {chooseRow, route} from "../src/route.js";
import {vContext} from "./vContext.js";

// many rows read one at a time: the list on the left at a width the page names, the reader on the right. The page's own header and filter bar
// go in the top slot. Up and down step the chosen row, and the chosen row is in the address so a reload keeps it.
// A row is built on ListRow: its title and one line of facts are cut with an ellipsis, and the whole title shows on hover. A page that wants more than words in the
// second line (a mark, a chip) fills the line slot, and one that has a right-click menu for its rows gives place(item).
const props = defineProps({
    items: {type: Array, required: true},
    listWidth: {type: Number, default: 360},
    emptyTitle: {type: String, default: "Nothing here yet"},
    pickLine: {type: String, default: "No row chosen"},
    place: {type: Function, default: null},
    // a page that wants its first row read at once, with no row named by the address
    openFirst: {type: Boolean, default: false},
});
const chosen = defineModel("chosen", {type: [String, Number], default: null});
const current = computed(() => props.items.find((item) => item.id === chosen.value) ?? null);
const groups = computed(() => [...new Set(props.items.map((item) => item.group || ""))]);
const inGroup = (group) => props.items.filter((item) => (item.group || "") === group);

function choose(item) {
    chosen.value = item.id;
    chooseRow(item.id);
}

function step(by) {
    const at = props.items.findIndex((item) => item.id === chosen.value);
    const next = props.items[Math.min(props.items.length - 1, Math.max(0, at + by))];
    if (next) choose(next);
}

const STEPS = {ArrowDown: 1, ArrowUp: -1};
function keyed(event) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || !STEPS[event.key]) return;
    event.preventDefault();
    step(STEPS[event.key]);
}

// the row the address names is chosen once the list has it, which for a page that reads its rows is after it is drawn; a page that opens its first row
// has it chosen when the address names none
watch(() => props.items.length, () => {
    if (chosen.value !== null) return;
    const wanted = props.items.find((item) => String(item.id) === route.value.row) ?? (props.openFirst ? props.items[0] : undefined);
    if (wanted) chosen.value = wanted.id;
}, {immediate: true});
</script>

<template>
    <div class="list-reader" data-list-reader>
        <slot name="top" />
        <div class="list-reader-body">
            <div class="list-reader-list" :style="{width: `${listWidth}px`}" tabindex="0" aria-label="List" data-reader-list @keydown="keyed">
                <template v-if="!items.length">
                    <EmptyState :title="emptyTitle"><slot name="empty" /></EmptyState>
                </template>
                <template v-for="group in groups" :key="group">
                    <template v-if="group">
                      <p class="list-reader-group">{{ group }}</p>
                    </template>
                    <template v-for="item in inGroup(group)" :key="item.id">
                        <button v-context="place ? () => place(item) : null" type="button" :class="['list-reader-row', {on: item.id === chosen}]" :title="item.title" :aria-current="item.id === chosen" data-reader-row :data-row="item.id" @click="choose(item)">
                            <ListRow :title="item.title" :text="item.desc || ''">
                                <template v-if="$slots.meta" #end><slot name="meta" :item="item" /></template>
                                <template v-if="$slots.line" #text><slot name="line" :item="item" /></template>
                            </ListRow>
                        </button>
                    </template>
                </template>
            </div>
            <div class="list-reader-reader" data-reader-pane>
                <template v-if="current">
                    <slot name="reader" :item="current" />
                </template>
                <template v-else-if="items.length">
                    <EmptyState :title="pickLine" />
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list-reader {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.list-reader-body {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 160px;
}

.list-reader-list {
    position: relative;
    flex: none;
    overflow-y: auto;
    border-right: 1px solid var(--border);
    outline: 0;
}

.list-reader-reader {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    overflow-y: auto;
}

.list-reader-group {
    margin: 0;
    padding: 10px var(--inset) 4px;
    color: var(--text-4);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.list-reader-row {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    border-bottom: 1px solid var(--border-inner);
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.list-reader-row.on {
    background: var(--sel);
    box-shadow: inset 2px 0 0 var(--accent);
}
</style>
