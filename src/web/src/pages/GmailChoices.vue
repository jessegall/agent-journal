<script setup>
import {computed, ref, watch} from "vue";
import {saveSettings} from "../actions/settings.js";
import {boardOf, settingsWith, textOf} from "../domain/integrations.js";
import ChoiceList from "../kit/ChoiceList.vue";
import TextInput from "../kit/TextInput.vue";
import {rows} from "../sync/rows.js";
import {store} from "../state/store.js";

const NAME = "gmail";
const boards = computed(() => rows("board").filter((row) => !row.deleted));
const board = computed(() => boardOf(store.settings, NAME));
const choices = computed(() => boards.value.map((row) => ({value: row.n, label: row.title, current: row.n === board.value})));
const account = ref(textOf(store.settings, NAME, "account"));
const search = ref(textOf(store.settings, NAME, "search"));

watch(() => textOf(store.settings, NAME, "account"), (next) => (account.value = next));
watch(() => textOf(store.settings, NAME, "search"), (next) => (search.value = next));

const save = (field, value) => saveSettings(settingsWith(store.settings, NAME, {[field]: value.trim()}));
const pickBoard = (n) => saveSettings(settingsWith(store.settings, NAME, {board: n}));
</script>

<template>
    <div class="choices">
        <h4 class="label">Address</h4>
        <p class="line">The Gmail address the app password belongs to.</p>
        <TextInput :value="account" type="email" placeholder="you@gmail.com" aria-label="Gmail address" data-gmail-account @input="account = $event.target.value" @change="save('account', account)" />
        <h4 class="label">Which mail</h4>
        <p class="line">The mail to read, as a Gmail label or search. For example label:journal or from:me is:unread. Nothing is read until you write one.</p>
        <TextInput :value="search" placeholder="label:journal" aria-label="Which Gmail mail to read" data-gmail-search @input="search = $event.target.value" @change="save('search', search)" />
        <h4 class="label">Board</h4>
        <template v-if="boards.length">
            <ChoiceList stacked :choices="choices" @pick="pickBoard" />
        </template>
        <template v-else>
            <p class="line">You have no board yet. Make one on the Board page.</p>
        </template>
    </div>
</template>

<style scoped>
.choices {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.label {
    margin: 4px 0 0;
    font-size: 12px;
    font-weight: 600;
}

.line {
    margin: 0;
    color: var(--text-2);
}
</style>
