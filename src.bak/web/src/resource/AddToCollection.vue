<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {open} from "../domain/records.js";
import Btn from "../kit/Btn.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["done"]);
const text = ref("");
const error = ref("");
const collections = computed(() => open("collection").map((c) => c.title));

async function add() {
    const name = text.value.trim();
    if (!name) return;
    error.value = "";
    try {
        const found =
            open("collection").find((c) => c.title.toLowerCase() === name.toLowerCase()) || (await api.create("collection", {title: name}));
        await api.addToCollection(found.n, [props.resource.ref]);
        emit("done");
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="collect">
        <TextInput
            :value="text"
            class="grow"
            list="open-collections"
            placeholder="A collection, or a new name"
            autofocus
            @keydown.enter="add"
            @input="text = $event.target.value"
            @keydown.esc="emit('done')"
        />
        <datalist id="open-collections">
            <template v-for="c in collections" :key="c">
                <option :value="c" />
            </template>
        </datalist>
        <Btn small @click="add">Add to collection</Btn>
        <Btn small @click="emit('done')">Cancel</Btn>
        <template v-if="error">
            <span class="error">{{ error }}</span>
        </template>
    </div>
</template>

<style scoped>
.collect {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
}

.grow {
    flex: 1;
}

.error {
    color: var(--danger);
    font-size: 12px;
}
</style>
