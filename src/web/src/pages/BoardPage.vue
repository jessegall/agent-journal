<script setup>
import {remember, remembered} from "../platform/storage.js";
import {boardOn} from "../composables/settings.js";
import {store} from "../state/store.js";
import {useKeyMap} from "../composables/keyMap.js";
import {useUndoToast} from "../composables/undoToast.js";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import TextInput from "../kit/TextInput.vue";
import Icon from "../kit/Icon.vue";
import Toast from "../kit/Toast.vue";
import Switch from "../kit/Switch.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TabBar from "../kit/TabBar.vue";
import NewBoard from "../board/NewBoard.vue";
import BoardMenu from "../board/BoardMenu.vue";
import TodoBoard from "../board/TodoBoard.vue";
import TicketBoard from "../board/TicketBoard.vue";
import {lens} from "../board/lanes.js";
import {loadLanes, pagesFrom} from "../board/lanePages.js";
import {load as loadRows, patched, rows} from "../sync/rows.js";
import {poke, usePoll} from "../composables/poll.js";
import {href, route} from "../route.js";

const LIVE = new Set(["todo", "work", "question", "plan", "agent", "ticket", "board"]);
const FIRST_BOARD_SEEN = "board.first-board-seen";
const text = ref("");
const boards = computed(() => rows("board").filter((board) => !board.completed && !board.deleted));
const archived = computed(() => rows("board").filter((board) => board.completed && !board.deleted));
const boardMenu = ref(false);
const boardMenuOpener = ref(null);
const boardMenuAnchor = computed(() => boardMenuOpener.value && boardMenuOpener.value.$el);
const tickets = computed(() => Boolean(store.board.lens.board));
const kind = computed(() => (tickets.value ? "tickets" : "todos"));
const chosenBoard = computed(() => store.board.lens.board);
const current = computed(() => boards.value.find((board) => board.n === store.board.lens.board));
const searching = ref(false);
const finder = ref(null);
const activeBoard = ref(null);
const newBoard = ref(false);
const showingDone = computed(() => store.board.lens.done !== false);
const tabs = computed(() => [{key: "0", title: "To-dos"}, ...boards.value.map((board) => ({key: String(board.n), title: board.title}))]);
const chosenTab = computed({get: () => String(store.board.lens.board || 0), set: (key) => lens({board: Number(key)})});
const removed = (n) => settle(boards.value.filter((board) => board.n !== n));
const newWork = () => activeBoard.value?.newWork("");
const notify = (next) => (toast.value = next);
const {toast, undo} = useUndoToast();
const refusal = ref("");
let clearing = 0;

useKeyMap(
    {"/": () => finder.value.focus(), n: newWork, z: (e) => (e.metaKey || e.ctrlKey) && undo()},
    () => !newBoard.value && !activeBoard.value?.writing
);

onMounted(async () => {
    const known = (await loadRows("board")).filter((board) => !board.completed && !board.deleted);
    newBoard.value = route.value.q === "new" || (!known.length && !remembered(FIRST_BOARD_SEEN, false));
    settle(known);
});

function settle(open) {
    if (open.some((board) => board.n === store.board.lens.board)) return;
    lens({board: open.length ? open[0].n : 0});
}

function refuse(e) {
    refusal.value = e.message;
    clearTimeout(clearing);
    clearing = setTimeout(() => (refusal.value = ""), 5000);
}

async function archive(board) {
    boardMenu.value = false;
    const at = boards.value.indexOf(board);
    const others = boards.value.filter((open) => open !== board);
    try {
        await patched(
            board,
            (row) => (row.completed = Date.now() / 1000),
            () => api.archiveBoard(board.n)
        );
        settle([...others.slice(at), ...others.slice(0, at).reverse()]);
        toast.value = {text: `Archived ${board.title}`, label: "Undo", action: () => restore(board)};
    } catch (e) {
        refuse(e);
    }
}

async function restore(board) {
    boardMenu.value = false;
    try {
        await patched(
            board,
            (row) => (row.completed = 0),
            () => api.restoreBoard(board.n)
        );
        lens({board: board.n});
    } catch (e) {
        refuse(e);
    }
}

function leaveNewBoard() {
    newBoard.value = false;
    remember(FIRST_BOARD_SEEN, true);
}

function boardMade(n) {
    leaveNewBoard();
    lens({board: n});
}

function take(got) {
    Object.assign(store.board, {
        lanes: got.lanes,
        agents: got.agents,
        slots: got.slots,
        roles: got.roles || [],
        questions: got.questions || [],
        drafting: got.drafting || {},
        expected: got.expected || 0,
        planHold: got.plan_hold,
        loaded: true,
    });
}

const page = (more) => (tickets.value ? api.ticketBoard(store.board.lens.board, more) : api.board({...store.board.lens, ...more}));
const query = () => text.value.trim();
pagesFrom(page, query);
const load = () => loadLanes(page, store.board.lanes, query());
const ask = usePoll(
    "board",
    () => (boardOn.value ? load() : Promise.resolve(null)),
    5000,
    (got) => got && take(got)
);
const refresh = () => ask();

watch(() => [store.board.lens.plan, store.board.lens.agent, store.board.lens.board, text.value.trim()], refresh);

let seen = 0;
watch(
    () => (store.events.length ? store.events[store.events.length - 1].id : 0),
    (newest) => {
        const fresh = store.events.some((event) => event.id > seen && LIVE.has(event.type));
        seen = newest;
        if (fresh) poke("board");
    }
);
</script>

<template>
    <section class="board">
        <header class="bar">
            <TabBar v-model="chosenTab" :tabs="tabs" class="board-tabs" />
            <Btn kind="icon" class="new-board" v-tip="'New board'" @click="newBoard = true">
                <Icon name="plus" />
            </Btn>
            <Btn
                ref="boardMenuOpener"
                kind="icon"
                :class="['board-settings', {spare: !current && !archived.length}]"
                v-tip="'Board settings'"
                @click.stop="boardMenu = !boardMenu"
            >
                <Icon name="settings" />
            </Btn>
            <template v-if="boardMenu">
                <BoardMenu
                    :board="current"
                    :archived="archived"
                    :anchor="boardMenuAnchor"
                    @close="boardMenu = false"
                    @archive="archive"
                    @restore="restore"
                    @new="((boardMenu = false), (newBoard = true))"
                />
            </template>
            <span class="grow" />
            <Btn kind="icon" :class="['search', {on: searching}]" v-tip="'Filter cards'" @click="searching = !searching">
                <Icon name="search" />
                <template v-if="text.trim()">
                    <span class="search-dot" />
                </template>
            </Btn>
            <div :class="['tools', {searching}]">
                <TextInput ref="finder" :value="text" class="find" placeholder="Filter cards  /" @input="text = $event.target.value" />
                <Switch :on="showingDone" word="Show done cards" @change="(on) => lens({done: on})" />
            </div>
            <Btn kind="primary" small v-tip="'New work (N)'" @click="newWork">
                <Icon name="plus" />
                New work
            </Btn>
        </header>
        <template v-if="!boardOn">
            <p class="off">
                Kanban boards are switched off.
                <a :href="href.page(route.env, 'settings')">Turn it on in Settings</a>
            </p>
        </template>
        <template v-else>
            <SwitchCase :value="kind">
                <template #todos>
                    <TodoBoard ref="activeBoard" :text="text" :refusal="refusal" :refresh="refresh" :refuse="refuse" :notify="notify" />
                </template>
                <template #tickets>
                    <TicketBoard
                        :key="chosenBoard"
                        ref="activeBoard"
                        :board="current || null"
                        :text="text"
                        :refusal="refusal"
                        :refresh="refresh"
                        :refuse="refuse"
                        :notify="notify"
                        @removed="removed"
                    />
                </template>
            </SwitchCase>
        </template>
        <Toast :toast="toast" @done="toast = null" />
        <NewBoard :open="newBoard" @close="leaveNewBoard" @made="boardMade" />
    </section>
</template>

<style scoped>
.board {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 4px;
    height: 44px;
    padding: 0 12px;
    border-bottom: 1px solid var(--border);
}

.board-tabs {
    flex: 0 1 auto;
    align-self: stretch;
    min-width: 0;
    padding: 0 8px;
}

.grow {
    flex: 1;
    min-width: 8px;
}

.new-board {
    flex: none;
}

.board-settings {
    flex: none;
}

.bar .board-settings.spare {
    display: none;
}

.bar .search {
    position: relative;
    display: none;
}

.search.on {
    background: var(--sel);
    color: var(--text);
}

.search-dot {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-text);
    box-shadow: 0 0 0 2px var(--bg);
}

.tools {
    display: flex;
    flex: none;
    align-items: center;
    gap: 12px;
    margin-right: 8px;
}

.find {
    width: 200px;
    height: 28px;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--side);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
}

.find:focus {
    border-color: var(--accent);
    outline: none;
}

.off {
    margin: 0;
    padding: 18px 20px;
    color: var(--text-2);
    font-size: 13px;
}

@media (max-width: 900px) {
    .find {
        width: 150px;
    }
}

@media (max-width: 640px) {
    .bar {
        flex-wrap: wrap;
        height: auto;
        min-height: 44px;
        padding: 0 6px 0 4px;
        row-gap: 0;
    }

    .board-tabs {
        flex: 1 1 0;
        height: 44px;
    }

    .bar .new-board {
        display: none;
    }

    .bar .board-settings.spare {
        display: grid;
    }

    .bar .search {
        display: grid;
    }

    .bar .search,
    .bar .board-settings {
        width: 40px;
        height: 40px;
    }

    .grow {
        display: none;
    }

    .tools {
        display: none;
        order: 10;
        flex-basis: 100%;
        height: 52px;
        margin: 0 -6px 0 -4px;
        padding: 0 14px;
        border-top: 1px solid var(--border);
    }

    .tools.searching {
        display: flex;
    }

    .find {
        flex: 1;
        width: auto;
        height: 36px;
    }
}
</style>
