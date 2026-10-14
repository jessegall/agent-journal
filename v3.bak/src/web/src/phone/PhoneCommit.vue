<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {renamedTo, statFiles} from "../domain/commits.js";
import {clock} from "../format/time.js";
import Diff from "../kit/Diff.vue";
import Cell from "./kit/Cell.vue";
import CellGroup from "./kit/CellGroup.vue";
import EmptyList from "./kit/EmptyList.vue";
import PlaceScreen from "./kit/PlaceScreen.vue";
import Skeleton from "../kit/Skeleton.vue";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const commit = ref(null);
const failed = ref("");
const files = computed(() => statFiles(commit.value?.stat));
const about = computed(() => (commit.value ? `${commit.value.author} · ${clock(commit.value.at)}` : ""));

async function load() {
    failed.value = "";
    try {
        commit.value = await api.commit(props.target);
    } catch (error) {
        failed.value = error.message;
    }
}

onMounted(load);
</script>

<template>
    <PlaceScreen :title="`Commit ${target.slice(0, 7)}`" :sub="about" :back="back" @back="emit('back')">
        <template v-if="failed">
            <EmptyList icon="warn" title="The commit did not load" :reason="failed" action="Try again" @act="load" />
        </template>
        <template v-else-if="!commit">
            <CellGroup><Skeleton :count="3" /></CellGroup>
        </template>
        <template v-else>
            <h2 class="commit-subject">{{ commit.subject }}</h2>
            <template v-if="commit.body.trim()">
                <p class="commit-body">{{ commit.body.trim() }}</p>
            </template>
            <CellGroup :head="`Files changed · ${files.length}`">
                <template v-for="file in files" :key="file.path">
                    <Cell
                        :label="renamedTo(file.path).split('/').pop()"
                        :sub="file.path.includes('/') ? file.path : ''"
                        :count="file.count"
                        icon="file"
                        @pick="emit('open', `file:${renamedTo(file.path)}`)"
                    />
                </template>
            </CellGroup>
            <template v-if="commit.diff">
                <CellGroup head="Changes">
                    <Diff class="commit-diff" :text="commit.diff" />
                </CellGroup>
            </template>
        </template>
    </PlaceScreen>
</template>

<style scoped>
.commit-subject {
    margin: 0 4px 8px;
    font-size: 1.0625rem;
    font-weight: 600;
    line-height: 1.35;
}

.commit-body {
    margin: 0 4px 16px;
    color: var(--text-2);
    font-size: 0.9375rem;
    line-height: 1.45;
    white-space: pre-wrap;
}

.commit-diff {
    margin: 0;
    overflow-x: auto;
    font-size: 0.75rem;
    line-height: 1.5;
}
</style>
