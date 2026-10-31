<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import Btn from "../kit/Btn.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({type: {type: String, required: true}, reference: {type: [String, Number], required: true}, place: {type: String, required: true}});
const {failure, attempt} = useAttempt();
// the panel publishes to and reads copies of one team's library, so it shows with exactly one team connected
const oneTeam = ref(false);
const copies = ref([]);
const publishing = ref(false);
const published = ref(0);
const fields = ref({description: "", note: ""});

const copy = computed(() => copies.value.find((c) => c.item_type === props.type && (c.place === props.place || c.name === props.place)));

async function load() {
    oneTeam.value = (await api.teams()).teams.length === 1;
    copies.value = oneTeam.value ? (await api.libraryCopies()).copies : [];
}

async function publish() {
    const {done, got} = await attempt(() => api.publishLibraryItem(props.type, String(props.reference), fields.value.note, fields.value.description || null));
    if (!done) return;
    published.value = got.number;
    publishing.value = false;
    fields.value = {description: "", note: ""};
}

onMounted(load);
</script>

<template>
    <template v-if="oneTeam">
        <div class="library-standing">
            <span class="library-standing-line">
                <template v-if="copy">From the library: version {{ copy.version }}</template>
                <template v-else-if="published">Published to the library: version {{ published }}</template>
                <template v-else>Not in the library</template>
            </span>
            <template v-if="!publishing">
                <Btn small @click="publishing = true">Publish to the library</Btn>
            </template>
            <template v-else>
                <div class="library-standing-form">
                    <TextInput v-model="fields.description" placeholder="What it is for, in one line (optional)" />
                    <TextInput v-model="fields.note" placeholder="What changed in this version" />
                    <span class="library-standing-buttons">
                        <Btn kind="primary" small @click="publish">Publish</Btn>
                        <Btn small @click="publishing = false">Cancel</Btn>
                    </span>
                </div>
            </template>
            <template v-if="failure">
                <p class="library-standing-failure">{{ failure }}</p>
            </template>
        </div>
    </template>
</template>

<style scoped>
.library-standing {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
}

.library-standing-line {
    flex: 1;
    color: var(--text-2);
}

.library-standing-form {
    display: flex;
    flex-basis: 100%;
    flex-direction: column;
    gap: 8px;
}

.library-standing-buttons {
    display: flex;
    gap: 8px;
}

.library-standing-failure {
    flex-basis: 100%;
    margin: 0;
    color: var(--tone-danger);
}
</style>
