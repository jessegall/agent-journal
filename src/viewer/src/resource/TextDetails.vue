<script setup>
import {computed, onMounted, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import {peekRef} from "../route.js";

// what a document's or a report's panel adds to its text: edit it, its chapters, the comments on it, what it links to, and for a document its revisions
const props = defineProps({kind: {type: String, required: true}, id: {type: Number, required: true}, row: {type: Object, required: true}, read: {type: Function, required: true}});
const emit = defineEmits(["changed"]);
const comments = ref([]);
const links = ref([]);
const revisions = ref([]);
const revision = ref(null);
const comment = ref("");
const failure = ref("");
const editing = ref(false);
const edited = ref({abstract: "", body: ""});

const chapters = computed(() => (props.row.body || "").split("\n").filter((line) => /^#{1,3} /.test(line)).map((line) => line.replace(/^#+ /, "")));
const targetRef = (link) => `${link.target_model}:${link.target_id}`;
const rowsOf = (answer) => (answer.ok ? answer.value.rows ?? [] : []);

async function load() {
    const [written, linked] = await Promise.all([props.read([props.kind, "comments", String(props.id)]), props.read(["link", "list", "--source", `${props.kind}:${props.id}`])]);
    comments.value = rowsOf(written);
    links.value = rowsOf(linked);
    if (props.kind === "doc") revisions.value = rowsOf(await props.read(["doc", "revisions", String(props.id)]));
}

async function run(line) {
    const answer = await props.read(line);
    failure.value = answer.ok ? "" : answer.error;
    return answer.ok;
}

async function write() {
    if (!comment.value.trim() || !(await run([props.kind, "comment", String(props.id), comment.value.trim()]))) return;
    comment.value = "";
    await load();
}

function edit() {
    edited.value = {abstract: props.row.abstract, body: props.row.body};
    editing.value = true;
}

async function save() {
    if (!(await run([props.kind, "edit", String(props.id), "--abstract", edited.value.abstract, "--body", edited.value.body]))) return;
    editing.value = false;
    emit("changed");
    await load();
}

async function showRevision(row) {
    const answer = await props.read(["doc", "revision", String(props.id), String(row.number)]);
    revision.value = answer.ok ? answer.value : null;
}

onMounted(load);
watch(() => props.id, load);
</script>

<template>
    <section class="text-details" data-text-details>
        <template v-if="failure">
            <p class="failure" role="alert" data-text-failure>{{ failure }}</p>
        </template>
        <div class="tools">
            <Btn small data-text-edit @click="edit">Edit</Btn>
        </div>
        <template v-if="editing">
            <form class="edit" data-text-form @submit.prevent="save">
                <input v-model="edited.abstract" aria-label="Abstract">
                <textarea v-model="edited.body" rows="14" aria-label="Text" />
                <div class="tools">
                    <Btn small kind="primary" type="submit" data-text-save>Save</Btn>
                    <Btn small @click="editing = false">Cancel</Btn>
                </div>
            </form>
        </template>
        <template v-if="chapters.length > 1">
            <p class="label">Chapters</p>
            <ol class="chapters" data-text-chapters>
                <template v-for="chapter in chapters" :key="chapter">
                    <li>{{ chapter }}</li>
                </template>
            </ol>
        </template>
        <p class="label">Comments</p>
        <template v-for="row in comments" :key="row.id">
            <p class="comment" data-text-comment>{{ row.text }}</p>
        </template>
        <form class="write" data-text-comment-form @submit.prevent="write">
            <input v-model="comment" placeholder="Write a comment" aria-label="Write a comment">
            <Btn small type="submit" :disabled="!comment.trim()">Send</Btn>
        </form>
        <template v-if="links.length">
            <p class="label">Links</p>
            <template v-for="link in links" :key="link.id">
                <Btn kind="text" data-text-link @click="peekRef(targetRef(link))">{{ link.link_type }} {{ targetRef(link) }}</Btn>
            </template>
        </template>
        <template v-if="revisions.length">
            <p class="label">Revisions</p>
            <template v-for="row in revisions" :key="row.number">
                <Btn kind="text" :data-text-revision="row.number" @click="showRevision(row)">Revision {{ row.number }}: {{ row.change || row.created_at }}</Btn>
            </template>
            <template v-if="revision">
                <pre class="revision" data-text-revision-body>{{ revision.body }}</pre>
            </template>
        </template>
    </section>
</template>

<style scoped>
.text-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 12px;
}

.tools,
.write {
    display: flex;
    gap: 6px;
    align-items: center;
}

.write,
.edit,
.edit input,
.edit textarea,
.write input {
    width: 100%;
}

.write input {
    flex: 1;
}

.edit {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

input,
textarea {
    padding: 5px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
}

.label {
    margin: 8px 0 0;
    color: var(--text-3);
    font-size: 12px;
}

.chapters {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
}

.comment {
    margin: 0;
    font-size: 13px;
}

.revision {
    width: 100%;
    max-height: 240px;
    overflow: auto;
    font-size: 12px;
    white-space: pre-wrap;
}

.failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
