<script setup>
import {computed} from "vue";
import ChoiceList from "../kit/ChoiceList.vue";
import {handedVariable, pickable, pickedBy} from "../domain/secrets.js";
import {rows} from "../sync/rows.js";

const props = defineProps({value: {type: String, default: ""}});
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
            <p class="secret-picker-line">You have no secret to pick yet. Add one under Settings, Secrets.</p>
        </template>
        <p class="secret-picker-line">
            {{ picked ? `The plugin gets the secret ${picked.title}.` : "No secret is picked, so the plugin gets no value." }}
            The plugin's services get this secret's value. Nothing else does.
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
