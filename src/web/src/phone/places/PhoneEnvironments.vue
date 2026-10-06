<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {phone} from "../../api/phone.js";
import {removeWords, sentence, sweepWords} from "../../domain/journals.js";
import {plainDoing} from "../doing.js";
import ActionSheet from "../kit/ActionSheet.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import FormSheet from "../kit/FormSheet.vue";
import NewButton from "../kit/NewButton.vue";
import PlaceScreen from "../kit/PlaceScreen.vue";
import {toast} from "../kit/toast.js";
import PhonePlaces from "../PhonePlaces.vue";
import {waitingCount, waitsOf} from "./journals.js";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "moved", "switching", "stayed"]);
const rows = ref(null);
const place = ref(null);
const failed = ref("");
const picked = ref(null);
const form = ref(null);
const opening = ref(null);
const environment = api.env();
const live = (row) => Boolean(place.value?.working.includes(row.title));
const detailOf = (row) => place.value?.details?.[row.title];
const here = (row) => row.title === environment;
const groups = computed(() =>
    [
        {key: "running", head: "Agent running", rows: (rows.value || []).filter(live)},
        {key: "quiet", head: "No agent running", rows: (rows.value || []).filter((row) => !live(row))},
    ].filter((group) => group.rows.length)
);
const subOf = (row) =>
    [here(row) ? "Current" : "", detailOf(row)?.doing ? plainDoing(detailOf(row).doing) : "", waitsOf(detailOf(row))]
        .filter(Boolean)
        .join(" · ");

async function load() {
    try {
        const [listed, got] = await Promise.all([api.list("environment"), phone.places()]);
        rows.value = listed.rows
            .filter((row) => !row.completed && !row.data.owner)
            .sort((a, b) => here(b) - here(a) || a.title.localeCompare(b.title));
        place.value = got.places.find((one) => one.root === got.at) || null;
    } catch (error) {
        failed.value = error.message;
    }
}

async function tried(work, done) {
    try {
        toast(done(await work()));
    } catch (error) {
        toast(error.message);
    }
    load();
}

const make = ({title}) =>
    tried(
        () => api.create("environment", {title}),
        () => `Made ${title}`
    );

function rename(row, {name}) {
    tried(
        () => api.act("environment", row.n, "rename", {name}),
        () => `Renamed ${row.title} to ${name}`
    );
    if (here(row)) emit("moved");
}

async function sweep(row) {
    try {
        const text = sweepWords(await api.sweepEnvironment(row.n, false));
        if (text === "There is nothing to archive.") return toast(text);
        form.value = {
            title: `Archive old items in ${row.title}?`,
            sub: text,
            button: "Archive now",
            done: () => tried(() => api.sweepEnvironment(row.n, true), sentence),
        };
    } catch (error) {
        toast(error.message);
    }
}

function removing(row, refusal = "") {
    form.value = {
        title: refusal ? `Archive ${row.title} anyway?` : `Archive ${row.title}?`,
        sub: refusal || removeWords({live: live(row), title: row.title}),
        button: refusal || live(row) ? "Archive anyway" : "Yes, archive",
        keep: "Keep it",
        danger: true,
        done: () => remove(row, Boolean(refusal)),
    };
}

async function remove(row, forced) {
    try {
        await api.removeEnvironment(row.n, forced);
        toast(`Archived ${row.title}`);
        load();
    } catch (error) {
        removing(row, error.message);
    }
}

const actionsOf = (row) => [
    {
        key: "open",
        label: here(row) ? "See its agent" : "Switch to it",
        sub: "Open it here, or start an agent in it",
        run: () => (opening.value = {root: place.value?.root, name: row.title}),
    },
    {
        key: "rename",
        label: "Rename",
        run: () =>
            (form.value = {
                title: `Rename ${row.title}`,
                fields: [{key: "name", label: "New name", value: row.title, required: true}],
                button: "Rename",
                done: (got) => rename(row, got),
            }),
    },
    {key: "sweep", label: "Archive old items", sub: "Moves old messages and closed items into the archive", run: () => sweep(row)},
    ...(here(row)
        ? []
        : [
              {
                  key: "remove",
                  label: "Archive environment",
                  sub: "Moves this environment into the archive",
                  danger: true,
                  run: () => removing(row),
              },
          ]),
];

function submitted(values) {
    const done = form.value.done;
    form.value = null;
    done(values);
}

const making = () =>
    (form.value = {
        title: "New environment",
        sub: "It has its own to-dos, agent and history.",
        fields: [{key: "title", label: "Name", required: true}],
        button: "Make it",
        done: make,
    });

onMounted(load);
</script>

<template>
    <PlaceScreen title="Environments" sub="Each has its own to-dos, agent and history." :back="back" @back="emit('back')">
        <template v-if="failed">
            <EmptyList
                icon="warn"
                title="The environments did not load"
                :reason="failed"
                action="Try again"
                @act="((failed = ''), load())"
            />
        </template>
        <template v-for="group in groups" :key="group.key">
            <CellGroup :head="`${group.head} · ${group.rows.length}`">
                <template v-for="row in group.rows" :key="row.n">
                    <Cell
                        :label="row.title"
                        :sub="subOf(row)"
                        icon="branch"
                        :count="waitingCount(detailOf(row)) || ''"
                        :hot="Boolean(waitingCount(detailOf(row)))"
                        @pick="picked = row"
                    />
                </template>
            </CellGroup>
        </template>
        <template #foot>
            <NewButton label="New environment" @press="making" />
        </template>
    </PlaceScreen>
    <template v-if="picked">
        <ActionSheet :title="picked.title" :about="`Environment ${picked.n}`" :actions="actionsOf(picked)" @close="picked = null" />
    </template>
    <template v-if="form">
        <FormSheet
            :key="form.title"
            :title="form.title"
            :sub="form.sub || ''"
            :fields="form.fields || []"
            :button="form.button"
            :keep="form.keep || 'Cancel'"
            :danger="Boolean(form.danger)"
            @close="form = null"
            @submit="submitted"
        />
    </template>
    <template v-if="opening">
        <PhonePlaces
            :environment="environment"
            :opening="opening"
            @close="opening = null"
            @switching="emit('switching')"
            @stayed="emit('stayed')"
            @moved="emit('moved')"
        />
    </template>
</template>
