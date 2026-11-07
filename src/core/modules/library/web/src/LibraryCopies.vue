<script setup>
import {ref} from "vue";
import {Btn, FormField, SidePanel, TextInput, useRunLine, useWindow} from "@journal/window-kit";
import CopyCompare from "./CopyCompare.vue";
import LibraryCopyRow from "./LibraryCopyRow.vue";

// the items of this journal that follow an item of the library, each with the status the journal worked out when it was read
const props = defineProps({copies: {type: Array, required: true}, role: {type: String, required: true}, canWrite: Boolean});
const emit = defineEmits(["changed"]);
const context = useWindow();
const KEEPS_REVISIONS = ["doc"];
const sharing = ref("");
const shared = ref(null);
const compared = ref(null);
const {refusal, run} = useRunLine(async () => emit("changed"));

// the library's text is the one stored with the copy, so Compare works with no network; a copy that stored none reads the item live
async function library(copy) {
    if (Object.keys(copy.server_fields).length) return copy.server_fields;
    context.state["item.share"] = copy.share;
    context.state["item.id"] = String(copy.item_id);
    await context.reload("item");
    const item = context.props.item;
    refusal.value = item.failure.value;
    return item.failure.value ? null : item.data.value.fields;
}

async function compare(copy, isTaking = false) {
    const there = await library(copy);
    compared.value = there ? {copy, there, isTaking} : null;
}

async function take(copy) {
    compared.value = null;
    await run(["library", "resolve", String(copy.copy_id), "--keep", "library"]);
}

const ACTIONS = {
    compare: (copy) => compare(copy),
    read: (copy) => compare(copy),
    send: (copy) => run(["library", "resolve", String(copy.copy_id), "--keep", "mine"]),
    mine: (copy) => run(["library", "resolve", String(copy.copy_id), "--keep", "mine"]),
    library: (copy) => (KEEPS_REVISIONS.includes(copy.share) ? take(copy) : compare(copy, true)),
    leave: (copy) => run(["library", "leave", String(copy.copy_id)]),
};

async function share() {
    const [name, number, ...rest] = sharing.value.trim().split(/\s+/);
    if (!name || !/^\d+$/.test(number ?? "") || rest.length) return void (refusal.value = "Write the type and the number, such as doc 63.");
    const answer = await run(["library", "share", name, number]);
    shared.value = answer.ok ? answer.value : null;
    if (answer.ok) sharing.value = "";
}
</script>

<template>
    <div class="copies" data-library-copies>
        <template v-if="canWrite">
            <form class="copies-share" data-library-share @submit.prevent="share">
                <FormField label="Share with the team" for="library-share" help="The type and the number of the item on this journal, such as doc 63.">
                    <TextInput id="library-share" v-model="sharing" placeholder="doc 63" data-library-share-field />
                </FormField>
                <Btn variant="primary" :disabled="!sharing.trim()" data-library-share-submit @click="share">Share</Btn>
            </form>
        </template>
        <template v-if="shared">
            <p class="copies-shared" data-library-shared>{{ shared.line }}</p>
            <template v-if="shared.warning">
                <p class="copies-failure" role="alert" data-library-warning>{{ shared.warning }}</p>
            </template>
        </template>
        <template v-if="refusal">
            <p class="copies-failure" role="alert" data-library-refusal>{{ refusal }}</p>
        </template>
        <template v-if="!copies.length">
            <p class="copies-empty" data-library-no-copies>No item on this journal follows an item of the library. Get one from the Library tab.</p>
        </template>
        <ul class="copies-list">
            <template v-for="copy in copies" :key="copy.copy_id">
                <LibraryCopyRow :copy="copy" :role="role" @choose="(chosen, key) => ACTIONS[key](chosen)" />
            </template>
        </ul>
        <template v-if="compared">
            <SidePanel :title="`Compare: ${compared.copy.local_fields.title}`" @close="compared = null">
                <div data-library-compare-panel>
                    <template v-if="!KEEPS_REVISIONS.includes(compared.copy.share)">
                        <p class="copies-failure" data-library-loss>The text on this journal is lost when you use the library's version: a {{ compared.copy.share }} keeps no earlier versions.</p>
                    </template>
                    <CopyCompare :here="compared.copy.local_fields" :library="compared.there" :at="new Date().toISOString()" />
                    <template v-if="compared.isTaking">
                        <Btn variant="primary" data-library-take @click="take(compared.copy)">Use the library's version</Btn>
                    </template>
                </div>
            </SidePanel>
        </template>
    </div>
</template>

<style scoped>
.copies {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.copies-share {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.copies-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.copies-failure {
    margin: 0;
    color: var(--danger);
    font-size: 13px;
}

.copies-empty {
    margin: 0;
    color: var(--text-3);
    font-size: 13px;
}
</style>
