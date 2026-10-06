<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import FormSheet from "./kit/FormSheet.vue";
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
    {name: "title", label: "Title", placeholder: `${kind.value.one} title, at most 80 characters`, required: true},
    {name: "abstract", label: "One short line about it", placeholder: "You can leave this empty"},
    {name: "brief", label: "Details", placeholder: "As long as they need to be", area: true},
    ...(props.type === "plan" ? [{name: "depth", label: "How thorough", options: DEPTHS}] : []),
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
</script>

<template>
    <button type="button" class="new-button" @click="writing = true">
        <span class="new-plus" aria-hidden="true"><Icon name="plus" :size="14" /></span>
        {{ kind.make || `New ${kind.word}` }}
    </button>
    <template v-if="writing">
        <FormSheet
            :title="kind.make || `New ${kind.word}`"
            :fields="fields"
            :values="{depth: 'normal'}"
            button="Add"
            @send="make"
            @close="writing = false"
        />
    </template>
</template>

<style scoped>
.new-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--accent);
    font: inherit;
    font-weight: 600;
}

.new-plus {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
}

.new-plus .ico {
    color: inherit;
}
</style>
