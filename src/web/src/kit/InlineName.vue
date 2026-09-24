<script setup>
import {ref, watch} from "vue";
import TextInput from "./TextInput.vue";

const props = defineProps({value: {type: String, default: ""}, placeholder: {type: String, default: ""}});
const emit = defineEmits(["done", "cancel"]);
const name = ref(props.value);
const field = ref(null);

watch(field, (input) => input && input.$el.select());

let finished = false;

function finish(event, ...args) {
    if (finished) return;
    finished = true;
    emit(event, ...args);
}

const done = () => (name.value.trim() ? finish("done", name.value.trim()) : finish("cancel"));
</script>

<template>
    <form class="inline-name" @submit.prevent="done" @click.stop>
        <TextInput
            ref="field"
            class="inline-name-field"
            :value="name"
            :placeholder="placeholder"
            @input="name = $event.target.value"
            @keydown.escape.stop="finish('cancel')"
            @blur="done"
        />
    </form>
</template>

<style scoped>
.inline-name {
    display: flex;
    flex: 1;
    min-width: 0;
}

.inline-name-field {
    flex: 1;
    padding: 4px 7px;
    font-size: 12px;
}
</style>
