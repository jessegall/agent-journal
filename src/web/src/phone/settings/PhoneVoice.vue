<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {saveSettings} from "../../actions/settings.js";
import {callings, loadProfiles} from "../../composables/profiles.js";
import {store} from "../../state/store.js";
import Button from "../kit/Button.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import Field from "../kit/Field.vue";
import {toast} from "../kit/toast.js";

const emit = defineEmits(["open"]);
const form = computed(() => (store.settings && store.settings.form_of_address) || {});
const title = ref("");
const name = ref("");
const busy = ref(false);

watch(form, (now) => ([title.value, name.value] = [now.title || "", now.first_name || ""]), {immediate: true});

async function save() {
    busy.value = true;
    try {
        await saveSettings({form_of_address: {...form.value, title: title.value.trim(), first_name: name.value.trim()}});
        toast("Saved: your title and name");
    } catch (error) {
        toast(error.message);
    } finally {
        busy.value = false;
    }
}

onMounted(() => loadProfiles().catch(() => {}));
</script>

<template>
    <Field v-model="title" class="voice-field" label="Your title" />
    <Field v-model="name" class="voice-field" label="Your name" />
    <p class="voice-foot">Profiles that use your title and name call you “{{ callings["title and name"] }}”.</p>
    <Button class="voice-save" fill :busy="busy" @click="save">Save</Button>
    <CellGroup>
        <Cell label="Profiles" sub="How the agent writes to you" icon="smile" @pick="emit('open', 'list:profile')" />
    </CellGroup>
</template>

<style scoped>
.voice-field {
    display: block;
    margin-bottom: 12px;
}

.voice-foot {
    margin: -4px 4px 14px;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.voice-save {
    margin-bottom: 18px;
}
</style>
