<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {answer} from "../../chat/answers.js";
import {DELETE_NOTE, closeNote, closeWord, word} from "../../domain/spec.js";
import ActionSheet from "../kit/ActionSheet.vue";
import FormSheet from "../kit/FormSheet.vue";
import {toast} from "../kit/toast.js";

const COLLECTABLE = ["todo", "plan", "suggestion", "doc", "report", "message", "fact", "rule", "ticket"];
const ANSWERED = ["question", "suggestion"];
const ADJUST = "Adjust";
const ADJUST_SUB = "Say what to do differently. A to-do is filed from your words.";

const props = defineProps({
    row: {type: Object, required: true},
    kind: {type: Object, required: true},
    changed: {type: Function, required: true},
});
const emit = defineEmits(["close", "open"]);
const form = ref(null);
const collections = ref([]);
const name = computed(() => `${props.kind.one} ${props.row.n}`);
const capital = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const options = computed(() =>
    (props.row.data.options || []).map((option) => {
        const title = option.title || option.label || "";
        return {title, sub: title === ADJUST ? ADJUST_SUB : capital(option.description || "")};
    })
);

async function act(method, body, text, undo = null) {
    try {
        await api.act(props.row.type, props.row.n, word(props.row.type, method), body);
        toast(text, undo);
    } catch (error) {
        toast(error.message);
    }
    props.changed();
}

const reopen = () => act("reopen", {why: "Reopened from the phone"}, `${name.value} is open again`);
const close = () => act("complete", {how: "Closed from the phone"}, `Closed ${name.value.toLowerCase()}`, reopen);
const remove = () => act("delete", {}, `Deleted ${name.value.toLowerCase()}`);

async function answerWith(choice) {
    await answer(props.row, choice);
    toast(`Answered ${name.value.toLowerCase()}: ${choice}`);
    props.changed();
}

async function dismiss() {
    try {
        await api.dismissQuestion(props.row.n, "Dismissed from the phone");
        toast(`Dismissed ${name.value.toLowerCase()}`);
    } catch (error) {
        toast(error.message);
    }
    props.changed();
}

async function run() {
    try {
        await api.runCheck(props.row.n);
        toast(`Running ${name.value.toLowerCase()}`);
    } catch (error) {
        toast(error.message);
    }
    props.changed();
}

onMounted(async () => {
    if (COLLECTABLE.includes(props.row.type)) collections.value = (await api.list("collection").catch(() => ({rows: []}))).rows;
});

function collect() {
    const open = collections.value;
    form.value = {
        title: "Add to a collection",
        sub: `Puts ${name.value.toLowerCase()} in a collection with related items. A new name makes a new collection.`,
        fields: [
            {key: "title", label: "Collection", placeholder: "Name of a collection", required: true, choices: open.map((one) => one.title)},
        ],
        button: "Add",
        done: async ({title}) => {
            try {
                const found =
                    open.find((one) => one.title.toLowerCase() === title.toLowerCase()) || (await api.create("collection", {title}));
                await api.addToCollection(found.n, [props.row.ref]);
                toast(`Added to ${title}`);
            } catch (error) {
                toast(error.message);
            }
        },
    };
}

const own = (title, label, sub = "") => ({
    title,
    sub,
    fields: [{key: "words", label, area: true, required: true}],
    button: "Send the answer",
    done: ({words}) => answerWith(words),
});

const pick = (option) =>
    option.title === ADJUST
        ? () => (form.value = own("Adjust the suggestion", "What to do differently", "A to-do is filed from your words."))
        : () => answerWith(option.title);

const sure = () =>
    (form.value = {
        title: `Delete ${name.value.toLowerCase()}?`,
        sub: DELETE_NOTE,
        fields: [],
        button: "Delete it",
        keep: "Keep it",
        danger: true,
        done: remove,
    });

const answers = computed(() =>
    ANSWERED.includes(props.row.type)
        ? [
              ...options.value.map((option, at) => ({key: `option-${at}`, label: option.title, sub: option.sub, run: pick(option)})),
              ...(props.row.type === "question"
                  ? [
                        {key: "own", label: "Answer in your own words", run: () => (form.value = own("Your answer", "Answer"))},
                        ...(props.row.completed
                            ? []
                            : [{key: "dismiss", label: "Dismiss the question", sub: "Closes it without an answer", run: dismiss}]),
                    ]
                  : []),
          ]
        : []
);

const ending = computed(() => {
    if (props.row.data.system || ANSWERED.includes(props.row.type)) return [];
    return props.row.completed
        ? [{key: "reopen", label: "Reopen", sub: "Moves it back to Open", run: reopen}]
        : [{key: "close", label: closeWord(props.row.type), sub: closeNote(props.row.type), run: close}];
});

const actions = computed(() => [
    {key: "open", label: "Open", run: () => emit("open", props.row.ref)},
    ...answers.value,
    ...(props.row.type === "check" ? [{key: "run", label: "Run it now", run}] : []),
    ...(COLLECTABLE.includes(props.row.type) ? [{key: "collect", label: "Add to a collection", run: collect}] : []),
    ...ending.value,
    ...(props.row.data.system ? [] : [{key: "delete", label: "Delete", sub: DELETE_NOTE, danger: true, run: sure}]),
]);

function submitted(values) {
    const done = form.value.done;
    form.value = null;
    emit("close");
    done(values);
}

const shut = () => nextTick(() => form.value || emit("close"));
</script>

<template>
    <template v-if="form">
        <FormSheet
            :key="form.title"
            :title="form.title"
            :sub="form.sub"
            :fields="form.fields"
            :button="form.button"
            :keep="form.keep || 'Cancel'"
            :danger="Boolean(form.danger)"
            @close="form && ((form = null), emit('close'))"
            @submit="submitted"
        />
    </template>
    <template v-else>
        <ActionSheet :title="row.title" :about="name" :actions="actions" @close="shut" />
    </template>
</template>
