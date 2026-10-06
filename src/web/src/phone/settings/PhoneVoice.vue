<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {saveSettings} from "../../actions/settings.js";
import {callings, loadProfiles} from "../../composables/profiles.js";
import {store} from "../../state/store.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
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
    <label class="voice-field">
        <span>Your title</span>
        <input v-model="title" type="text" />
    </label>
    <label class="voice-field">
        <span>Your name</span>
        <input v-model="name" type="text" />
    </label>
    <p class="voice-foot">Profiles that use your title and name call you “{{ callings["title and name"] }}”.</p>
    <button type="button" class="voice-save" :disabled="busy" @click="save">Save</button>
    <CellGroup>
        <Cell label="Profiles" sub="How the agent writes to you" icon="smile" @pick="emit('open', 'list:profile')" />
    </CellGroup>
</template>

<style scoped>
.voice-field {
    display: block;
    margin-bottom: 12px;
}

.voice-field span {
    display: block;
    margin-bottom: 6px;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.voice-field input {
    width: 100%;
    min-height: 44px;
    padding: 0 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
}

.voice-foot {
    margin: -4px 4px 14px;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.voice-save {
    width: 100%;
    min-height: 44px;
    margin-bottom: 18px;
    border: 0;
    border-radius: 12px;
    background: var(--accent);
    color: #fff;
    font: inherit;
}
</style>
