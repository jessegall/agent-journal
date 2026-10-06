<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import FormSheet from "./kit/FormSheet.vue";
import NewButton from "./kit/NewButton.vue";
import {toast} from "./kit/toast.js";
import {kindOf} from "./kinds.js";

const props = defineProps({type: {type: String, required: true}});
const emit = defineEmits(["made"]);
const DEPTHS = [
    {key: "normal", label: "Normal"},
    {key: "thorough", label: "Thorough"},
];
const writing = ref(false);
const kind = computed(() => kindOf(props.type));
const fields = computed(() => [
    {key: "title", label: "Title", placeholder: `${kind.value.one} title, at most 80 characters`, required: true},
    ...(props.type === "collection"
        ? []
        : [
              {key: "abstract", label: "One short line about it", placeholder: "You can leave this empty"},
              {key: "brief", label: "Details", placeholder: "As long as they need to be", area: true},
          ]),
    ...(props.type === "plan" ? [{key: "depth", label: "How thorough", options: DEPTHS, value: "normal"}] : []),
]);

async function make(values) {
    try {
        const made = await api.create(props.type, values);
        toast(`Added ${kind.value.word} ${made.n}`);
        emit("made", made);
    } catch (error) {
        toast(error.message);
    }
}

defineExpose({open: () => (writing.value = true)});
</script>

<template>
    <NewButton :label="kind.make || `New ${kind.word}`" @press="writing = true" />
    <template v-if="writing">
        <FormSheet :title="kind.make || `New ${kind.word}`" :fields="fields" button="Add" @submit="make" @close="writing = false" />
    </template>
</template>
