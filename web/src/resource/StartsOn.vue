<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import {meta, types} from "../state/store.js";

const props = defineProps({resource: Object});
const BY_HAND = "";
const MOMENTS = {created: "is created", completed: "is finished"};
const changing = ref(false);

const moment = computed(() => props.resource.data.starts_on || BY_HAND);
const chosenType = computed(() => moment.value.split(".")[0]);
const chosenAction = computed(() => moment.value.split(".")[1] || "created");
const sentence = computed(() =>
    moment.value === BY_HAND
        ? "Runs only when you or the agent start it."
        : `Starts by itself when a ${(meta(chosenType.value).title || chosenType.value).toLowerCase()} ${MOMENTS[chosenAction.value]}.`
);
const kinds = computed(() => [
    {value: BY_HAND, label: "Nothing, only by hand", current: moment.value === BY_HAND},
    ...types.value
        .filter((t) => (t.in_sidebar || t.needs_attention) && t.name !== "sequence")
        .map((t) => ({value: t.name, label: t.title, current: chosenType.value === t.name})),
]);
const actions = computed(() => Object.entries(MOMENTS).map(([value, label]) => ({value, label, current: chosenAction.value === value})));

function save(value) {
    return api.act("sequence", props.resource.n, "set", {key: "starts_on", value});
}
</script>

<template>
    <section class="starts">
        <h3>When it starts</h3>
        <div class="starts-line">
            <span>{{ sentence }}</span>
            <template v-if="!resource.data.system">
                <Btn small @click="changing = !changing">{{ changing ? "Done" : "Change" }}</Btn>
            </template>
        </div>
        <template v-if="changing">
            <span class="starts-label">What starts it</span>
            <ChoiceList :choices="kinds" @pick="(type) => save(type === BY_HAND ? BY_HAND : `${type}.${chosenAction}`)" />
            <template v-if="moment !== BY_HAND">
                <span class="starts-label">When that kind of row</span>
                <ChoiceList :choices="actions" @pick="(action) => save(`${chosenType}.${action}`)" />
            </template>
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

.starts-line {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-2);
}

.starts-label {
    margin-top: 4px;
    color: var(--text-3);
    font-size: 12px;
}
</style>
