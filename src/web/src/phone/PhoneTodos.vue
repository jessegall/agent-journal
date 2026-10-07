<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {named} from "../board/lanes.js";
import {shiftQuestion} from "../board/moves.js";
import {usePoll} from "../composables/poll.js";
import Segmented from "../kit/Segmented.vue";
import {itemActions} from "./acts.js";
import ActionSheet from "./kit/ActionSheet.vue";
import BigTitle from "./kit/BigTitle.vue";
import Chips from "./kit/Chips.vue";
import CellGroup from "./kit/CellGroup.vue";
import EmptyList from "./kit/EmptyList.vue";
import FormSheet from "./kit/FormSheet.vue";
import NavBar from "./kit/NavBar.vue";
import SearchField from "./kit/SearchField.vue";
import {useScrolled} from "./kit/scrolled.js";
import {toast} from "./kit/toast.js";
import {place} from "./outbox.js";
import PhoneActs from "./PhoneActs.vue";
import PhoneNew from "./PhoneNew.vue";
import PhoneNewBoard from "./PhoneNewBoard.vue";
import PhoneSkeletonRows from "./PhoneSkeletonRows.vue";
import PhoneTodoRow from "./PhoneTodoRow.vue";

const BOARD_EVERY = 15000;
const UNDONE = "Undone on the phone right after it was marked done";
const VIEWS = [
    {key: "list", label: "List"},
    {key: "board", label: "Board"},
];
const LISTED = ["doing", "asked", "todo", "held"];
const ORDERS = [
    {key: "priority", label: "Priority", sort: (one, other) => other.priority - one.priority || one.n - other.n},
    {key: "newest", label: "Newest first", sort: (one, other) => other.n - one.n},
    {key: "title", label: "A to Z", sort: (one, other) => one.title.localeCompare(other.title)},
];

const emit = defineEmits(["open"]);
const lanes = ref([]);
const loaded = ref(false);
const failed = ref("");
const view = ref("list");
const words = ref("");
const order = ref("priority");
const showDone = ref(false);
const doneLane = ref(true);
const lane = ref("todo");
const sheet = ref("");
const acting = ref(null);
const asking = ref(null);
const acts = ref(null);
const {under, scrolled} = useScrolled();

const refresh = usePoll(
    "phone-todos",
    () => api.board(),
    BOARD_EVERY,
    (got) => {
        lanes.value = got.lanes;
        loaded.value = true;
        failed.value = "";
    }
);
const sorter = computed(() => ORDERS.find((one) => one.key === order.value));
const titleOf = (key) => lanes.value.find((one) => one.key === key)?.title || key;
const cardsOf = (key) => (lanes.value.find((one) => one.key === key)?.cards || []).map((card) => ({...card, lane: key}));
const sorted = (cards) => cards.filter(named(words.value)).sort(sorter.value.sort);
const groups = computed(() => LISTED.map((key) => ({key, title: titleOf(key), cards: sorted(cardsOf(key))})).filter((one) => one.cards.length));
const done = computed(() => sorted(cardsOf("done")));
const open = computed(() => LISTED.reduce((sum, key) => sum + cardsOf(key).length, 0));
const chips = computed(() =>
    lanes.value.filter((one) => doneLane.value || one.key !== "done").map((one) => ({key: one.key, label: one.title, count: one.cards.length}))
);
const shown = computed(() => sorted(cardsOf(lane.value)));
const environment = computed(() => place.value.split("/")[1] || "");
const empty = computed(() => loaded.value && !open.value && !cardsOf("done").length);

async function act(card, word, body, text, undo = null) {
    try {
        await api.act("todo", card.n, word, body);
        toast(text, undo);
    } catch (error) {
        toast(error.message);
    }
    refresh();
}

const markDone = (card) =>
    act(card, "done", {}, `Marked to-do ${card.n} done`, () => act(card, "reopen", {why: UNDONE}, `To-do ${card.n} is open again`));

async function shift(card, target, body = {}) {
    try {
        await api.shift(card.n, target, body);
        toast(`Moved to-do ${card.n} to ${titleOf(target)}`);
    } catch (error) {
        toast(error.message);
    }
    refresh();
}

function moved(card, target) {
    const question = shiftQuestion(card, target);
    if (!question) return shift(card, target);
    asking.value = {
        title: `Move to-do ${card.n} to ${titleOf(target)}`,
        sub: card.title,
        fields: [{key: question.word, label: question.title, required: question.required}],
        send: (values) => shift(card, target, values),
    };
    return null;
}

async function more(card) {
    try {
        acting.value = await api.show("todo", card.n);
        sheet.value = "actions";
    } catch (error) {
        toast(error.message);
    }
}

const actionsOf = (row) => [
    {key: "open", label: "Open", run: () => emit("open", `todo:${row.n}`)},
    ...itemActions(row).map((action) => ({...action, run: () => acts.value.begin(action)})),
];
const orders = computed(() => ORDERS.map((one) => ({key: one.key, label: one.label, check: one.key === order.value, run: () => (order.value = one.key)})));
const archived = ref([]);
const settings = computed(() => [
    {key: "done", label: "Show the Done lane", check: doneLane.value, run: () => (doneLane.value = !doneLane.value)},
    {key: "new-board", label: "Make a new board", sub: "Pick its stages, or build it from a document", run: () => (sheet.value = "new-board")},
    ...archived.value.map((board) => ({key: `board-${board.n}`, label: board.title, sub: "Archived board · Restore it", run: () => restore(board)})),
]);

async function openSettings() {
    try {
        archived.value = (await api.list("board", {last: 25, completed: true})).rows.filter((board) => board.completed);
    } catch (error) {
        toast(error.message);
    }
    sheet.value = "settings";
}

async function restore(board) {
    try {
        await api.restoreBoard(board.n);
        toast(`Restored ${board.title}`);
    } catch (error) {
        toast(error.message);
    }
}

const made = (row) => (refresh(), emit("open", `todo:${row.n}`));
</script>

<template>
    <div class="screen">
        <NavBar title="To-dos" :under="under" />
        <div class="screen-scroll" data-scroller @scroll.passive="scrolled">
            <BigTitle title="To-dos" :sub="environment ? `${environment} · ${open} open` : `${open} open`" />
            <Segmented class="todos-views" :options="VIEWS" :value="view" fill aria-label="Show the to-dos as" @pick="view = $event" />
            <SearchField v-model="words" :label="view === 'list' ? 'Search to-dos' : 'Find a card on the board'" />
            <template v-if="!loaded">
                <CellGroup aria-busy="true" aria-label="Loading"><PhoneSkeletonRows :count="5" /></CellGroup>
            </template>
            <template v-else-if="empty">
                <EmptyList icon="todos" title="No open to-dos" reason="When you or the agent add a to-do, it shows here." />
            </template>
            <template v-else-if="view === 'list'">
                <template v-for="group in groups" :key="group.key">
                    <CellGroup :head="`${group.title} · ${group.cards.length}`">
                        <template v-for="card in group.cards" :key="card.n">
                            <PhoneTodoRow
                                :card="card"
                                @open="emit('open', `todo:${card.n}`)"
                                @more="more(card)"
                                @done="markDone(card)"
                                @shift="moved(card, $event)"
                            />
                        </template>
                    </CellGroup>
                </template>
                <template v-if="words && !groups.length">
                    <p class="todos-none">No open to-do matches “{{ words }}”.</p>
                </template>
                <template v-if="done.length">
                    <CellGroup :head="`Done · ${done.length}`">
                        <template v-if="showDone">
                            <template v-for="card in done" :key="card.n">
                                <PhoneTodoRow :card="card" @open="emit('open', `todo:${card.n}`)" @more="more(card)" />
                            </template>
                        </template>
                    </CellGroup>
                    <button type="button" class="todos-link" @click="showDone = !showDone">
                        {{ showDone ? "Hide the done to-dos" : `Show ${done.length} done` }}
                    </button>
                </template>
            </template>
            <template v-else>
                <Chips :options="chips" :value="lane" label="Lanes" @pick="lane = $event" />
                <template v-if="shown.length">
                    <CellGroup foot="To move a card to another lane, press ⋯ on it and choose Move to another lane.">
                        <template v-for="card in shown" :key="card.n">
                            <PhoneTodoRow :card="card" still @open="emit('open', `todo:${card.n}`)" @more="more(card)" />
                        </template>
                    </CellGroup>
                </template>
                <template v-else>
                    <EmptyList
                        icon="board"
                        :title="`No to-dos in ${titleOf(lane)}`"
                        reason="To move one here, press ⋯ on it and choose Move to another lane."
                    />
                </template>
            </template>
        </div>
        <footer class="screen-foot todos-foot">
            <PhoneNew type="todo" @made="made" />
            <template v-if="view === 'list'">
                <button type="button" class="todos-link" @click="sheet = 'order'">Order: {{ sorter.label }}</button>
            </template>
            <template v-else>
                <button type="button" class="todos-link" @click="openSettings">Board settings</button>
            </template>
        </footer>
    </div>
    <template v-if="sheet === 'order'">
        <ActionSheet title="Order the to-dos" about="To-dos" line="pick one" :actions="orders" @close="sheet = ''" />
    </template>
    <template v-if="sheet === 'settings'">
        <ActionSheet title="Board settings" about="Board" line="lanes and boards" :actions="settings" @close="sheet = ''" />
    </template>
    <template v-if="sheet === 'new-board'">
        <PhoneNewBoard @made="refresh" @close="sheet = ''" />
    </template>
    <template v-if="sheet === 'actions' && acting">
        <ActionSheet :title="acting.title" :about="`To-do ${acting.n}`" :actions="actionsOf(acting)" @close="sheet = ''" />
    </template>
    <template v-if="acting">
        <PhoneActs ref="acts" :row="acting" @changed="refresh" @gone="refresh" />
    </template>
    <template v-if="asking">
        <FormSheet :title="asking.title" :sub="asking.sub" :fields="asking.fields" button="Move" @submit="asking.send" @close="asking = null" />
    </template>
</template>

<style scoped>
.todos-views {
    margin: 4px 0 10px;
}

.todos-none {
    margin: 16px 4px;
    color: var(--text-3);
}

.todos-link {
    min-height: 44px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--accent);
    font: inherit;
}

.todos-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
