<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import EmptyState from "../kit/EmptyState.vue";
import Notice from "../kit/Notice.vue";
import {clock} from "../format/time.js";
import {readerScript, skillFolder} from "../domain/library.js";

const props = defineProps({type: {type: String, required: true}, name: {type: String, required: true}, team: {type: String, default: ""}});
const emit = defineEmits(["changed"]);
const {failure, attempt} = useAttempt();
const shown = ref(null);

const versions = computed(() => [...(shown.value?.versions || [])].sort((a, b) => b.number - a.number));
const newest = computed(() => versions.value[0]?.number || 0);
const imported = computed(() => shown.value?.imported_version || 0);
const edited = computed(() => shown.value?.edited_fields || []);
const script = computed(() => (props.type === "reader" ? readerScript(versions.value[0]) : ""));

async function load() {
    shown.value = await api.libraryItem(props.type, props.name, props.team);
}

async function importNewest() {
    const {done} = await attempt(() => api.importLibraryItem(props.type, props.name, newest.value, Boolean(script.value), props.team));
    if (done) await changed();
}

async function update(replace) {
    const {done} = await attempt(() => api.updateLibraryItem(props.type, props.name, replace, props.team));
    if (done) await changed();
}

async function changed() {
    await load();
    emit("changed");
}

watch(() => [props.type, props.name], load, {immediate: true});
</script>

<template>
    <div class="library-item">
        <template v-if="!shown">
            <EmptyState loading />
        </template>
        <template v-else>
            <header class="library-item-head">
                <h2>{{ shown.item.name }}</h2>
                <Chip>{{ shown.item.item_type }}</Chip>
            </header>
            <template v-if="shown.item.description">
                <p class="library-item-description">{{ shown.item.description }}</p>
            </template>
            <div class="library-item-bar">
                <span class="library-item-standing">
                    Newest: version {{ newest }}<template v-if="imported"> · Imported: version {{ imported }}</template>
                </span>
                <template v-if="!imported">
                    <Btn kind="primary" small @click="importNewest">{{ script ? `Import version ${newest}, its script read` : `Import version ${newest}` }}</Btn>
                </template>
                <template v-else-if="imported < newest && !edited.length">
                    <Btn kind="primary" small @click="update(false)">Update to version {{ newest }}</Btn>
                </template>
            </div>
            <template v-if="script && !imported">
                <div class="library-item-script">
                    <span>Runs on your commands' output, as written here; read it before you import it:</span>
                    <pre>{{ script }}</pre>
                </div>
            </template>
            <template v-if="type === 'skill' && !imported">
                <p class="library-item-description">Imports into {{ skillFolder(name) }}, beside the project's own skills.</p>
            </template>
            <template v-if="imported < newest && edited.length">
                <Notice tone="ask" icon="edit">
                    <b>The copy in this journal was edited: {{ edited.join(", ") }}.</b> Replacing it writes version {{ newest }} over those changes.
                    <template #actions>
                        <Btn kind="primary" small @click="update(true)">Replace the copy with version {{ newest }}</Btn>
                    </template>
                </Notice>
            </template>
            <template v-if="failure">
                <p class="library-item-failure">{{ failure }}</p>
            </template>
            <ol class="library-item-versions">
                <template v-for="version in versions" :key="version.number">
                    <li>
                        <b>Version {{ version.number }}</b>
                        <span>{{ clock(version.published_at) }}</span>
                        <template v-if="version.note">
                            <p>{{ version.note }}</p>
                        </template>
                    </li>
                </template>
            </ol>
        </template>
    </div>
</template>

<style scoped>
.library-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.library-item-head {
    display: flex;
    align-items: center;
    gap: 10px;
}

.library-item-head h2 {
    margin: 0;
    font-size: 16px;
}

.library-item-description {
    margin: 0;
    color: var(--text-2);
}

.library-item-bar {
    display: flex;
    align-items: center;
    gap: 10px;
}

.library-item-standing {
    flex: 1;
    color: var(--text-2);
}

.library-item-script {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--text-2);
}

.library-item-script pre {
    margin: 0;
    padding: 10px 12px;
    border: 1px solid var(--border-3);
    border-radius: 6px;
    overflow-x: auto;
    white-space: pre-wrap;
}

.library-item-failure {
    margin: 0;
    color: var(--tone-danger);
}

.library-item-versions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.library-item-versions li {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    padding: 8px 0;
    border-top: 1px solid var(--border-3);
}

.library-item-versions span {
    color: var(--text-2);
}

.library-item-versions p {
    flex-basis: 100%;
    margin: 0;
    color: var(--text-2);
}
</style>
