<script setup>
import {computed} from "vue";
import ChoiceList from "../kit/ChoiceList.vue";
import {handedVariable, pickable, pickedBy} from "../domain/secrets.js";
import {rows} from "../sync/rows.js";

const props = defineProps({
    value: {type: String, default: ""},
    pickedLine: {type: String, default: "The plugin gets the secret {title}."},
    noneLine: {type: String, default: "No secret is picked, so the plugin gets no value."},
    note: {type: String, default: "The plugin's services get this secret's value. Nothing else does."},
});
const emit = defineEmits(["pick"]);
const secrets = computed(() => pickable(rows("secret").filter((row) => !row.deleted)));
const picked = computed(() => pickedBy(secrets.value, props.value));
const choices = computed(() =>
    secrets.value.map((row) => ({value: handedVariable(row), label: row.title, hint: row.abstract, current: row === picked.value}))
);
</script>

<template>
    <div class="secret-picker">
        <template v-if="secrets.length">
            <ChoiceList stacked :choices="choices" @pick="emit('pick', $event)" />
        </template>
        <template v-else>
            <p class="secret-picker-line">You have no secret to pick yet. Add one on the Secrets page.</p>
        </template>
        <p class="secret-picker-line">
            {{ picked ? pickedLine.replace("{title}", picked.title) : noneLine }}
            {{ note }}
        </p>
    </div>
</template>

<style scoped>
.secret-picker {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.secret-picker-line {
    margin: 0;
    color: var(--text-2);
}
</style>
