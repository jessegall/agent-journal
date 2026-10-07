<script setup>
import {computed, ref} from "vue";
import {makeBoard} from "../board/makeBoard.js";
import {PRESETS} from "../board/presets.js";
import Segmented from "../kit/Segmented.vue";
import Button from "./kit/Button.vue";
import Field from "./kit/Field.vue";
import {toast} from "./kit/toast.js";
import PhoneSheet from "./PhoneSheet.vue";

const emit = defineEmits(["close", "made"]);
const DOCUMENT = "document";
const options = [...PRESETS.map((one) => ({key: one.key, label: one.suggest})), {key: DOCUMENT, label: "From a document"}];
const chosen = ref(PRESETS[0].key);
const name = ref("");
const steer = ref("");
const file = ref(null);
const picker = ref(null);
const making = ref(false);
const sheet = ref(null);
const preset = computed(() => PRESETS.find((one) => one.key === chosen.value) || null);
const lead = computed(() => {
    if (!preset.value) return "The agent reads the document, chooses the stages and fills them with tickets.";
    return preset.value.stages.length ? preset.value.stages.map(([stage]) => stage).join(" · ") : preset.value.note;
});
const ready = computed(() => Boolean(preset.value) || Boolean(file.value));

async function create() {
    making.value = true;
    try {
        const made = await makeBoard({preset: preset.value, file: preset.value ? null : file.value, name: name.value.trim(), steer: steer.value});
        toast(`Made the board ${made.title || name.value.trim() || ""}`.trim());
        emit("made", made);
        sheet.value.close();
    } catch (error) {
        toast(error.message);
    } finally {
        making.value = false;
    }
}
</script>

<template>
    <PhoneSheet ref="sheet" label="New board" tall @close="emit('close')">
        <h2 class="board-title">New board</h2>
        <Segmented class="board-presets" :options="options" :value="chosen" wrap aria-label="Stages of the board" @pick="chosen = $event" />
        <p class="board-lead">{{ lead }}</p>
        <template v-if="!preset">
            <Button kind="plain" fill @click="picker.click()">{{ file ? file.name : "Choose a document" }}</Button>
            <input ref="picker" type="file" hidden @change="file = $event.target.files[0] || null" />
            <Field v-model="steer" label="Anything to know?" placeholder="Keep stages simple, five at most" />
        </template>
        <Field v-model="name" label="Name" :placeholder="preset ? preset.suggest : 'The agent names it from the document, or type your own'" />
        <Button class="board-make" fill :busy="making" :disabled="!ready" @click="create">
            {{ preset ? "Create board" : "Build the board" }}
        </Button>
    </PhoneSheet>
</template>

<style scoped>
.board-title {
    margin: 4px 0 10px;
    font-size: 1.0625rem;
    font-weight: 600;
    text-align: center;
}

.board-presets {
    margin-bottom: 10px;
}

.board-lead {
    margin: 0 0 12px;
    color: var(--text-3);
    font-size: 0.875rem;
}

.board-make {
    margin-top: auto;
}
</style>
