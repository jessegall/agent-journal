<script setup>
import {ref} from "vue";
import {Btn, FormField, SidePanel, TextInput, useRunLine, useWindow} from "@journal/window-kit";
import CopyCompare from "./CopyCompare.vue";
import LibraryCopyRow from "./LibraryCopyRow.vue";

// the items of this journal that follow an item of the library, each with the status the journal worked out when it was read
const props = defineProps({copies: {type: Array, required: true}, role: {type: String, required: true}, canWrite: Boolean});
const emit = defineEmits(["changed"]);
const context = useWindow();
const sharing = ref("");
const shared = ref(null);
const compared = ref(null);
const {refusal, run} = useRunLine(async () => emit("changed"));

// the library's text is the one stored with the copy, so Compare works with no network; a copy that stored none reads the item live
async function library(copy) {
    if (Object.keys(copy.server_fields).length) return copy.server_fields;
    const answer = await context.read(`library show ${copy.share} ${copy.item_id}`);
    refusal.value = answer.ok ? "" : answer.error;
    return answer.ok ? answer.value.fields : null;
}

async function compare(copy) {
    const there = await library(copy);
    compared.value = there ? {copy, there} : null;
}

const ACTIONS = {
    compare,
    read: compare,
    mine: (copy) => run(["library", "resolve", String(copy.copy_id), "--keep", "mine"]),
    library: (copy) => run(["library", "resolve", String(copy.copy_id), "--keep", "library"]),
    leave: (copy) => run(["library", "leave", String(copy.copy_id)]),
};

async function share() {
    const [name, number, ...rest] = sharing.value.trim().split(/\s+/);
    if (!name || !/^\d+$/.test(number ?? "") || rest.length) return void (refusal.value = "Write the kind and the number, such as doc 63.");
    const answer = await run(["library", "share", name, number]);
    shared.value = answer.ok ? answer.value : null;
    if (answer.ok) sharing.value = "";
}
</script>

<template>
    <div class="copies" data-library-copies>
        <template v-if="canWrite">
            <form class="copies-share" data-library-share @submit.prevent="share">
                <FormField label="Share with the team" for="library-share" help="The kind and the number of the item on this journal, such as doc 63.">
                    <TextInput id="library-share" v-model="sharing" placeholder="doc 63" data-library-share-field />
                </FormField>
                <Btn kind="primary" :disabled="!sharing.trim()" data-library-share-submit @click="share">Share</Btn>
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
                    <CopyCompare :here="compared.copy.local_fields" :library="compared.there" :at="new Date().toISOString()" />
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
