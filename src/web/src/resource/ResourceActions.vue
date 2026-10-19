<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {actsOf, editsOf} from "../domain/acts.js";
import {label} from "../domain/tables.js";
import TextInput from "../kit/TextInput.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";

const props = defineProps({resource: Object});
const emit = defineEmits(["edit", "close"]);
const error = ref("");
const asking = ref(null);
const how = ref("");
const acts = computed(() => actsOf(props.resource));
const editable = computed(() => Object.keys(editsOf(props.resource)).length > 0);

async function run(act) {
    error.value = "";
    try {
        await api.act(props.resource.table, props.resource.id, act.name, act.asks ? {how: how.value} : {});
        asking.value = null;
        how.value = "";
        if (act.name === "delete") emit("close");
    } catch (e) {
        error.value = e.message;
    }
}

const press = (act) => (act.asks ? (asking.value = act) : run(act));
</script>

<template>
    <div class="actions">
        <template v-if="asking">
            <TextInput
                :value="how"
                class="grow"
                :placeholder="label(resource.table, 'outcome', 'Say how it ended')"
                autofocus
                @keydown.enter="run(asking)"
                @input="how = $event.target.value"
                @keydown.esc="asking = null"
            />
            <Btn small @click="run(asking)">{{ asking.label }}</Btn>
            <Btn small @click="asking = null">Cancel</Btn>
        </template>
        <template v-else>
            <template v-if="editable">
                <Btn small @click="emit('edit')">
                    <Icon name="pencil" :size="12" />
                    Edit
                </Btn>
            </template>
            <template v-for="act in acts" :key="act.name">
                <Btn :class="{'delete-action': act.danger}" :kind="act.danger ? 'danger' : 'ghost'" small @click="press(act)">
                    {{ act.label }}
                </Btn>
            </template>
        </template>
        <template v-if="error">
            <span class="error">{{ error }}</span>
        </template>
    </div>
</template>

<style scoped>
.actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin: 10px 0;
}
.grow {
    flex: 1;
}
.error {
    color: var(--danger);
    font-size: 12px;
}
.delete-action {
    margin-left: 14px;
}
</style>
