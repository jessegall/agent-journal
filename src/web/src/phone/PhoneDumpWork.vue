<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {useDump} from "../composables/dump.js";
import {PHASE_WORDS} from "../domain/dumpPile.js";
import Icon from "../kit/Icon.vue";
import {itemActions} from "./acts.js";
import ActionSheet from "./kit/ActionSheet.vue";
import Button from "./kit/Button.vue";
import Cell from "./kit/Cell.vue";
import CellGroup from "./kit/CellGroup.vue";
import FormSheet from "./kit/FormSheet.vue";
import {toast} from "./kit/toast.js";
import PhoneActs from "./PhoneActs.vue";
import PhoneDumpReport from "./PhoneDumpReport.vue";

const OWN_WORDS = ["choose", "decline", "direct", "answer", "name"];
const STATES = {waiting: "Not read yet", read: "Read", filed: "Filed", failed: "Could not be read"};

const props = defineProps({every: {type: Array, required: true}, n: {type: Number, required: true}});
const emit = defineEmits(["open", "changed"]);
const picker = ref(null);
const acts = ref(null);
const moreOpen = ref(false);
const form = ref("");
const merging = ref(null);
const {
    dump,
    items,
    settled,
    working,
    asked,
    guesses,
    removed,
    phase,
    collection,
    filedRows,
    lines,
    reportTitle,
    summary,
    suggestions,
    summing,
    thinking,
    note,
    listed,
    more,
    adding,
    addMore,
    answer,
    say,
    take,
    leave,
    renameCollection,
} = useDump(
    computed(() => props.every),
    computed(() => props.n),
    () => [],
    (row) => `${api.env()}|dump:${row.n}`
);

const FORMS = {
    answer: {title: "Answer the agent", field: "Your answer", button: "Send the answer", run: (text) => answer(text)},
    say: {title: "Tell the agent", field: "How to sort it, or a question about what was filed", button: "Send", run: (text) => say(text)},
    name: {title: "Rename the collection", field: "Name", button: "Rename", run: (text) => renameCollection(text)},
};
const actions = computed(() => [
    ...(collection.value && !removed.value ? [{key: "name", label: "Rename the collection", run: () => (form.value = "name")}] : []),
    ...(filedRows.value.length > 1 ? [{key: "merge", label: "Merge two into one document", run: () => (merging.value = new Set())}] : []),
    ...itemActions(dump.value)
        .filter((action) => !OWN_WORDS.includes(action.word))
        .map((action) => ({...action, run: () => acts.value.begin(action)})),
]);
const madeSub = (m) => (m.writing ? "Writing…" : [m.kind, m.from.length ? `from ${m.from.join(", ")}` : ""].filter(Boolean).join(" · "));

async function sent(text) {
    const chosen = FORMS[form.value];
    form.value = "";
    try {
        await chosen.run(text);
        toast("Sent to the agent");
        emit("changed");
    } catch (error) {
        toast(error.message);
    }
}

async function added(event) {
    await addMore(event.target.files);
    event.target.value = "";
    emit("changed");
}

function pickMade(m) {
    if (!merging.value) return m.row && emit("open", m.ref);
    const picked = new Set(merging.value);
    if (picked.has(m.ref)) picked.delete(m.ref);
    else picked.add(m.ref);
    merging.value = picked;
}

async function merge() {
    const picked = filedRows.value.filter((m) => merging.value.has(m.ref));
    merging.value = null;
    const list = picked.map((m) => `“${m.row.title}” (${m.ref})`).join(" and ");
    await say(`Merge ${list} into one document, named for both, and file it where the first one is.`);
    toast("The agent merges them");
}
</script>

<template>
    <CellGroup>
        <Cell :label="PHASE_WORDS[phase]" :sub="thinking || note" icon="inbox" still />
    </CellGroup>
    <template v-if="asked">
        <CellGroup head="Question" :line="asked">
            <template v-for="guess in guesses" :key="guess">
                <Cell :label="guess" icon="reply" @pick="answer(guess)" />
            </template>
            <Cell :label="guesses.length ? 'Answer in your own words' : 'Answer'" icon="pencil" @pick="form = 'answer'" />
        </CellGroup>
    </template>
    <template v-if="phase === 'done'">
        <PhoneDumpReport
            :title="reportTitle"
            :lines="lines"
            :summary="summary"
            :summing="summing"
            :suggestions="suggestions"
            @take="take"
            @leave="leave"
        />
    </template>
    <template v-if="listed.length">
        <CellGroup :head="merging ? 'Pick two to merge' : 'Filed'">
            <template v-for="m in listed" :key="m.ref">
                <Cell :label="m.row ? m.row.title : m.making || m.ref" :sub="madeSub(m)" icon="docs" :still="!m.row" @pick="pickMade(m)">
                    <template v-if="merging" #end>
                        <Icon :name="merging.has(m.ref) ? 'check' : 'dot'" :size="18" />
                    </template>
                </Cell>
            </template>
        </CellGroup>
    </template>
    <CellGroup :head="`Files · ${settled} of ${items.length} done`">
        <template v-for="item in items" :key="item.name">
            <Cell :label="item.label" :sub="item.note || STATES[item.state]" icon="file" still />
        </template>
        <template v-for="name in adding" :key="`adding-${name}`">
            <Cell :label="name" sub="Adding…" icon="file" still />
        </template>
        <template v-if="working">
            <Cell icon="plus" label="Add more files" @pick="picker.click()" />
        </template>
    </CellGroup>
    <template v-if="more.error">
        <p class="dump-error" role="alert">{{ more.error }}</p>
    </template>
    <input ref="picker" type="file" multiple hidden aria-label="More files to send" @change="added" />
    <div class="dump-foot">
        <template v-if="merging">
            <Button :disabled="merging.size < 2" @click="merge">Merge into one document</Button>
            <Button kind="plain" @click="merging = null">Cancel</Button>
        </template>
        <template v-else>
            <Button @click="form = 'say'">{{ working ? "Say how to sort it" : "Ask about it" }}</Button>
            <Button kind="plain" aria-haspopup="dialog" @click="moreOpen = true">More</Button>
        </template>
    </div>
    <template v-if="moreOpen">
        <ActionSheet :title="dump.title" :about="`Dump ${dump.n}`" :actions="actions" @close="moreOpen = false" />
    </template>
    <template v-if="form">
        <FormSheet
            :title="FORMS[form].title"
            :fields="[{key: 'text', label: FORMS[form].field, area: true, required: true}]"
            :button="FORMS[form].button"
            @close="form = ''"
            @submit="({text}) => sent(text)"
        />
    </template>
    <PhoneActs ref="acts" :row="dump" @changed="emit('changed')" @gone="emit('changed')" />
</template>

<style scoped>
.dump-error {
    margin: 0 4px 12px;
    color: var(--danger);
}

.dump-foot {
    display: flex;
    gap: 8px;
    margin: 8px 0 16px;
}

.dump-foot > * {
    flex: 1;
}
</style>
