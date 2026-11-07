<script setup>
import {computed, ref, watch} from "vue";
import {ListTools, Skeleton, WindowRoom, useListTools, useWindow} from "@journal/window-kit";

const STATES = {new: "New", noted: "Noted", filed: "Filed", failed: "Failed"};
const TYPES = {docs: "Document", doc: "Document", plans: "Plan", plan: "Plan", tasks: "Task", task: "Task", reports: "Report", report: "Report"};
const SETTLED = ["noted", "filed", "failed"];
const window = useWindow();
const {data, failure: readFailure, loaded} = window.props.dumps;
const cards = ref([]);
const actionFailure = ref("");
const failure = computed(() => actionFailure.value || readFailure.value);
const total = computed(() => data.value ? data.value.total : 0);
watch(data, (board) => {
    cards.value = board ? board.dumps : [];
    actionFailure.value = "";
}, {immediate: true});
const chosen = ref(null);
const renaming = ref(null);
const draft = ref("");
const tools = useListTools(cards, {title: (card) => card.title || `Dump ${card.id}`, isOpen: (card) => !card.outcome});
const shown = computed(() => tools.shown.value);
const openId = computed(() => chosen.value ?? (shown.value[0] ? shown.value[0].id : null));

const nameOf = (card) => card.title || `Dump ${card.id}`;
const phaseOf = (card) => (card.outcome ? "Filed" : "Filing");
const settledOf = (card) => card.items.filter((item) => SETTLED.includes(item.state)).length;
const madeOf = (card) => card.items.flatMap((item) => item.refs.map((ref) => ({ref, from: item.text})));
const typeOf = (ref) => TYPES[ref.split(":")[0]] || ref.split(":")[0];

async function more() {
    const answer = await window.readKey("dumps", {before: Math.min(...cards.value.map((card) => card.id))});
    if (!answer.ok) return void (actionFailure.value = answer.error);
    cards.value = [...cards.value, ...answer.value.dumps];
}

function startRename(card) {
    renaming.value = card.id;
    draft.value = card.title;
}

async function rename(card) {
    const title = draft.value.trim();
    renaming.value = null;
    if (!title || title === card.title) return;
    const answer = await window.run(["dump", "name", String(card.id), title]);
    if (!answer.ok) actionFailure.value = answer.error;
}
</script>

<template>
    <WindowRoom>
        <div class="dumps">
            <template v-if="!loaded">
                <Skeleton shape="cards" />
            </template>
            <template v-else-if="failure">
                <p class="dumps-note">{{ failure }}</p>
            </template>
            <template v-else-if="!cards.length">
                <p class="dumps-note">No dumps</p>
            </template>
            <ListTools :tools="tools" />
            <template v-for="card in shown" :key="card.id">
                <template v-if="card.id === openId">
                    <section class="dump" :data-dump="card.id">
                        <header class="dump-head">
                            <template v-if="renaming === card.id">
                                <input v-model="draft" class="dump-name" data-dump-name maxlength="80" @keydown.enter="rename(card)" @blur="rename(card)">
                            </template>
                            <template v-else>
                                <h3 class="dump-title">{{ nameOf(card) }}</h3>
                            </template>
                            <span class="dump-pill" :data-phase="phaseOf(card)">{{ phaseOf(card) }}</span>
                            <template v-if="!card.outcome && renaming !== card.id">
                                <button type="button" class="dump-rename" data-dump-rename @click="startRename(card)">Rename</button>
                            </template>
                        </header>
                        <p class="dump-brief">{{ card.outcome ? `Closed: ${card.outcome}` : card.brief }}</p>
                        <template v-if="card.items.length">
                            <div class="dump-progress" data-dump-progress>
                                <span class="dump-bar"><span class="dump-fill" :style="{width: `${(100 * settledOf(card)) / card.items.length}%`}" /></span>
                                <span class="dump-count">{{ settledOf(card) }} of {{ card.items.length }} files settled</span>
                            </div>
                        </template>
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
                        <template v-if="madeOf(card).length">
                            <h4 class="made-title">{{ madeOf(card).length }} items created</h4>
                            <template v-for="made in madeOf(card)" :key="`${made.ref}-${made.from}`">
                                <div class="made" data-made>
                                    <span class="made-type">{{ typeOf(made.ref) }}</span>
                                    <span class="made-ref">{{ made.ref }}</span>
                                    <span class="made-from">From {{ made.from }}</span>
                                </div>
                            </template>
                        </template>
                    </section>
                </template>
                <template v-else>
                    <button type="button" class="dump dump-earlier" :data-dump="card.id" @click="chosen = card.id">
                        <span class="dump-title">{{ nameOf(card) }}</span>
                        <span class="dump-pill" :data-phase="phaseOf(card)">{{ phaseOf(card) }}</span>
                    </button>
                </template>
            </template>
            <template v-if="cards.length < total">
                <button type="button" class="dumps-more" @click="more">Show more</button>
            </template>
        </div>
    </WindowRoom>
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

.dump-earlier {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.dump-head {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dump-title {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
}

.dump-name {
    flex: 1;
    font-size: 13px;
}

.dump-pill {
    padding: 1px 8px;
    border-radius: 10px;
    color: var(--text-3);
    font-size: 11px;
    border: 1px solid var(--border);
}

.dump-pill[data-phase="Filed"] {
    color: var(--accent-text);
}

.dump-rename,
.dumps-more {
    color: var(--text-3);
    background: none;
    border: 0;
    cursor: pointer;
}

.dump-rename {
    margin-left: auto;
    font-size: 12px;
}

.dumps-more {
    align-self: flex-start;
}

.dump-brief,
.dumps-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.dump-progress {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-3);
    font-size: 12px;
}

.dump-bar {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: var(--border);
}

.dump-fill {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--accent-text);
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

.made-title {
    margin: 8px 0 0;
    font-size: 12px;
    font-weight: 500;
}

.made {
    display: flex;
    gap: 10px;
    font-size: 12px;
}

.made-type {
    color: var(--accent-text);
}

.made-from {
    color: var(--text-3);
}
</style>
