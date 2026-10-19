<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import {asking, isWaiting, keptWords, kindOf, whenWords} from "../domain/secrets.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import CopyButton from "../kit/CopyButton.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import ListBox from "../kit/ListBox.vue";
import Notice from "../kit/Notice.vue";
import {hasLoaded, rows} from "../sync/rows.js";

const emit = defineEmits(["open", "new"]);
const {failure, attempt} = useAttempt();
const kept = ref([]);
const path = ref("");

const secrets = computed(() => rows("secrets").filter((row) => !row.deleted_at));
const waiting = computed(() => asking(secrets.value));

async function load() {
    const got = await api.list("secrets", {closed: true});
    kept.value = got.rows.filter((row) => row.deleted_at);
}

async function restore(row) {
    const {done} = await attempt(() => api.act("secrets", row.id, "restore"));
    if (done) await load();
}

watch(() => rows("secrets").length, load);
onMounted(async () => {
    load();
    path.value = (await api.secretsFile()).path;
});
</script>

<template>
    <div class="secrets">
        <template v-for="row in waiting" :key="row.id">
            <Notice tone="ask" icon="key">
                <b>The agent is waiting for a secret: {{ row.title }}</b>
                                <template #actions>
                    <Btn kind="primary" small @click="emit('open', row.id)">Enter the values</Btn>
                </template>
            </Notice>
        </template>
        <ListBox title="Secrets" :count="secrets.length">
            <template v-for="row in secrets" :key="row.id">
                <button type="button" class="secret-row" @click="emit('open', row.id)">
                    <Icon :name="kindOf(row).icon" :size="16" />
                    <span class="secret-row-text">
                        <b>{{ row.title }}</b>
                        <span>{{ whenWords(row) }}</span>
                    </span>
                    <template v-if="isWaiting(row)">
                        <Chip tone="accent">Needs a value</Chip>
                    </template>
                    <Icon name="chevron" :size="12" />
                </button>
            </template>
            <template v-if="!secrets.length">
                <EmptyState :loading="!hasLoaded('secrets')">
                    No secrets yet. Add a key or a login the agent may use without seeing it.
                </EmptyState>
            </template>
        </ListBox>
        <div class="secrets-bar">
            <Btn kind="primary" @click="emit('new')">
                <Icon name="plus" :size="12" />
                New secret
            </Btn>
        </div>
        <div class="secrets-file">
            <b>Where the values are kept</b>
            <p>Only you can read this file. It is outside the project, so no copy of the journal holds a value.</p>
            <div class="secrets-path">
                <code>{{ path }}</code>
                <CopyButton :text="path" label="Copy path" />
            </div>
        </div>
        <template v-if="kept.length">
            <ListBox title="Deleted secrets" :count="kept.length">
                <template v-for="row in kept" :key="row.id">
                    <div class="secret-row">
                        <Icon :name="kindOf(row).icon" :size="16" />
                        <span class="secret-row-text">
                            <b>{{ row.title }}</b>
                            <span>{{ keptWords(row) }}</span>
                        </span>
                        <Btn small @click="restore(row)">Restore</Btn>
                    </div>
                </template>
            </ListBox>
        </template>
        <template v-if="failure">
            <p class="secret-failure">{{ failure }}</p>
        </template>
    </div>
</template>
