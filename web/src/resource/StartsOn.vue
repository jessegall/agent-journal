<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import ChoiceList from "../kit/ChoiceList.vue";
import {types} from "../state/store.js";

const props = defineProps({resource: Object});
const BY_HAND = "";
const MOMENTS = ["created", "completed"];

const moment = computed(() => props.resource.data.starts_on || BY_HAND);
const chosenType = computed(() => moment.value.split(".")[0]);
const chosenAction = computed(() => moment.value.split(".")[1] || "created");
const kinds = computed(() => [
    {value: BY_HAND, label: "By hand only", current: moment.value === BY_HAND},
    ...types.value
        .filter((t) => (t.in_sidebar || t.needs_attention) && t.name !== "sequence")
        .map((t) => ({value: t.name, label: t.title, current: chosenType.value === t.name})),
]);
const actions = computed(() =>
    MOMENTS.map((a) => ({value: a, label: a === "created" ? "is created" : "is finished", current: chosenAction.value === a}))
);

function save(value) {
    return api.act("sequence", props.resource.n, "set", {key: "starts_on", value});
}
</script>

<template>
    <section class="starts">
        <h3>Starts by itself when</h3>
        <ChoiceList :choices="kinds" @pick="(type) => save(type === BY_HAND ? BY_HAND : `${type}.${chosenAction}`)" />
        <template v-if="moment !== BY_HAND">
            <ChoiceList :choices="actions" @pick="(action) => save(`${chosenType}.${action}`)" />
        </template>
    </section>
</template>

<style scoped>
.starts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 20px;
}

h3 {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}
</style>
