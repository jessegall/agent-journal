<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {meta} from "../domain/spec.js";
import {rowsOf} from "../domain/plans.js";
import {kindOf} from "./kinds.js";
import {loadSpec} from "./manifest.js";
import ActionSheet from "./kit/ActionSheet.vue";
import FormSheet from "./kit/FormSheet.vue";
import ItemRow from "./kit/ItemRow.vue";
import ListScreen from "./kit/ListScreen.vue";
import NewButton from "./kit/NewButton.vue";
import {newestFirst} from "./kit/listed.js";
import {toast} from "./kit/toast.js";
import PhoneFamily from "./places/PhoneFamily.vue";
import PhonePluginAdd from "./places/PhonePluginAdd.vue";
import PhoneRowActions from "./places/PhoneRowActions.vue";
import PhoneShelves from "./places/PhoneShelves.vue";
import {dotOf, linesOf} from "./places/rowLines.js";
import {holding, onShelf} from "./places/shelves.js";

const CLOSED_AT_MOST = 50;
const ORDERS = {
    new: {label: "Newest first", order: null},
    title: {label: "A to Z", order: (a, b) => a.title.localeCompare(b.title)},
};

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const kind = computed(() => kindOf(props.target));
const list = ref(null);
const acting = ref(null);
const choosing = ref(false);
const making = ref(false);
const adding = ref(false);
const spec = ref(false);
const counts = ref({open: 0, all: 0});
const closed = ref([]);
const showClosed = ref(false);
const todos = ref([]);
const collections = ref([]);
const shelf = ref("");
const order = ref("new");
const docs = computed(() => (props.target === "doc" ? list.value?.rows || [] : []));
const shelves = computed(() => holding(collections.value, docs.value));
const keep = computed(() => (props.target === "doc" ? onShelf(shelf.value, shelves.value) : () => true));
const closedCount = computed(() => counts.value.all - counts.value.open);
const makes = computed(() => Boolean(spec.value && kind.value.make && meta(props.target)?.created_in_viewer));
const empty = computed(() => ({
    icon: kind.value.icon,
    title: `No open ${kind.value.many.toLowerCase()}`,
    reason: `${kind.value.intro} None are open here right now.`,
    action: makes.value ? kind.value.make : "",
}));
const orders = computed(() =>
    Object.entries(ORDERS).map(([key, one]) => ({
        key,
        label: one.label,
        sub: order.value === key ? "Shown now" : "",
        run: () => (order.value = key),
    }))
);

const page = newestFirst(props.target);

async function everyRow() {
    const rows = [];
    for (let before = 0, more = true; more; before = rows.at(-1)?.n || 0) {
        const got = await page({before});
        rows.push(...got.rows);
        more = got.more && got.rows.length > 0;
    }
    return {rows, more: false};
}

async function phaseTodos(rows) {
    const numbers = rows.flatMap((row) => (row.data.phases ? rowsOf(row) : []));
    todos.value = numbers.length ? (await api.list("todo", {only: numbers, completed: true}).catch(() => ({rows: []}))).rows : [];
}

const EXTRAS = {
    plan: (got) => phaseTodos(got.rows),
    doc: async () => (collections.value = (await api.list("collection").catch(() => ({rows: []}))).rows),
};

async function load(at) {
    const got = props.target === "doc" ? await everyRow() : await page(at);
    await EXTRAS[props.target]?.(got);
    return got;
}

async function count() {
    try {
        counts.value = (await api.dashboard([props.target], {last: 1})).counts[props.target] || counts.value;
    } catch {
        counts.value = {open: 0, all: 0};
    }
}

async function loadClosed() {
    const got = await api.list(props.target, {completed: true, last: CLOSED_AT_MOST}).catch(() => ({rows: []}));
    closed.value = got.rows.filter((row) => row.completed).reverse();
    if (props.target === "plan") await phaseTodos([...(list.value?.rows || []), ...closed.value]);
}

async function toggleClosed() {
    showClosed.value = !showClosed.value;
    if (showClosed.value) await loadClosed();
}

function changed() {
    count();
    if (showClosed.value) loadClosed();
    return list.value?.reload();
}

async function make({title, abstract, brief}) {
    try {
        const made = await api.create(props.target, {title, abstract, brief});
        toast(`Added ${kind.value.one.toLowerCase()} ${made.n}`);
        changed();
    } catch (error) {
        toast(error.message);
    }
}

const lines = (row) => linesOf(kind.value, row, todos.value);
const newFields = computed(() => [
    {key: "title", label: "Title", placeholder: `${kind.value.one} title, at most 80 characters`, required: true},
    ...(props.target === "collection"
        ? []
        : [
              {key: "abstract", label: "One short line about it", placeholder: "Optional"},
              {key: "brief", label: "Details", placeholder: "Extra details, as long as they need to be", area: true},
          ]),
]);

onMounted(async () => {
    count();
    spec.value = Boolean(await loadSpec().catch(() => null));
});
</script>

<template>
    <ListScreen
        ref="list"
        :title="kind.many"
        :intro="kind.intro"
        :back="back"
        :load="load"
        :empty="empty"
        :keep="keep"
        :order="ORDERS[order].order"
        @back="emit('back')"
        @act="making = true"
    >
        <template #top>
            <template v-if="target === 'doc' && shelves.length">
                <PhoneShelves :docs="docs" :collections="shelves" :shelf="shelf" @pick="shelf = $event" />
            </template>
            <template v-if="target === 'agent'">
                <PhoneFamily @open="emit('open', $event)" />
                <h2 class="kind-head">Every agent</h2>
            </template>
        </template>
        <template #row="{row}">
            <ItemRow
                :title="row.title"
                :about="`${kind.one} ${row.n}`"
                :meta="lines(row)"
                :state="dotOf(row)"
                @open="emit('open', row.ref)"
                @more="acting = row"
            />
        </template>
        <template #bottom>
            <template v-if="closedCount > 0">
                <button type="button" class="kind-closed" @click="toggleClosed">
                    {{ showClosed ? `Hide the closed ${kind.many.toLowerCase()}` : `Show ${closedCount} closed` }}
                </button>
                <template v-if="showClosed && closed.length">
                    <div class="kind-group">
                        <template v-for="row in closed" :key="row.n">
                            <ItemRow
                                :title="row.title"
                                :about="`${kind.one} ${row.n}`"
                                :meta="lines(row)"
                                state="done"
                                @open="emit('open', row.ref)"
                                @more="acting = row"
                            />
                        </template>
                    </div>
                </template>
            </template>
        </template>
        <template #foot>
            <div class="kind-foot">
                <template v-if="target === 'plugin'">
                    <NewButton label="Add a plugin" @press="adding = true" />
                </template>
                <template v-else-if="makes">
                    <NewButton :label="kind.make" @press="making = true" />
                </template>
                <template v-else>
                    <span />
                </template>
                <button type="button" class="kind-order" @click="choosing = true">Order: {{ ORDERS[order].label }}</button>
            </div>
        </template>
    </ListScreen>
    <template v-if="acting">
        <PhoneRowActions :row="acting" :kind="kind" :changed="changed" @open="emit('open', $event)" @close="acting = null" />
    </template>
    <template v-if="choosing">
        <ActionSheet :title="`Order the ${kind.many.toLowerCase()}`" :about="kind.many" :actions="orders" @close="choosing = false" />
    </template>
    <template v-if="adding">
        <PhonePluginAdd :changed="changed" @close="adding = false" />
    </template>
    <template v-if="making">
        <FormSheet :title="kind.make" :fields="newFields" button="Add" @close="making = false" @submit="make" />
    </template>
</template>

<style scoped>
.kind-head {
    margin: 18px 4px 8px;
    color: var(--text-3);
    font-size: 0.8125rem;
    font-weight: 600;
}

.kind-closed {
    width: 100%;
    min-height: 44px;
    margin-top: 10px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
}

.kind-group {
    overflow: hidden;
    border-radius: 12px;
    background: var(--raised);
}

.kind-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.kind-order {
    min-height: 44px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
}
</style>
