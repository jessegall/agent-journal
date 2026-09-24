<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import {meta, types} from "../state/store.js";

const props = defineProps({resource: Object, bare: Boolean});
const BY_HAND = "";
const MOMENTS = {created: "is created", completed: "is finished"};
const TRIGGERED = /^trigger:(\d+)$/;
const changing = ref(false);
const triggers = ref([]);

const moment = computed(() => props.resource.data.starts_on || BY_HAND);
const fired = computed(() => TRIGGERED.exec(moment.value));
const chosenType = computed(() => (fired.value ? "" : moment.value.split(".")[0]));
const chosenAction = computed(() => moment.value.split(".")[1] || "created");
const trigger = ref(null);
watch(
    () => fired.value && fired.value[1],
    async (n) => (trigger.value = n ? await api.show("trigger", Number(n)).catch(() => null) : null),
    {immediate: true}
);
const heard = computed(() => (trigger.value ? trigger.value.data.words.map((w) => `“${w}”`).join(", ") : ""));
const sentence = computed(() => {
    if (moment.value === BY_HAND) return "Runs only when you or the agent start it.";
    if (fired.value && heard.value) return `Starts by itself when you write ${heard.value} (trigger ${fired.value[1]}).`;
    if (fired.value) return `Starts by itself when trigger ${fired.value[1]} fires.`;
    return `Starts by itself when a ${(meta(chosenType.value).title || chosenType.value).toLowerCase()} ${MOMENTS[chosenAction.value]}.`;
});
const kinds = computed(() => [
    {value: BY_HAND, label: "Nothing, only by hand", current: moment.value === BY_HAND},
    ...types.value
        .filter((t) => (t.in_sidebar || t.needs_attention) && !["sequence", "trigger"].includes(t.name))
        .map((t) => ({value: t.name, label: t.title, current: chosenType.value === t.name})),
]);
const firing = computed(() =>
    triggers.value.map((t) => ({value: `trigger:${t.n}`, label: `${t.title} (trigger ${t.n})`, current: moment.value === `trigger:${t.n}`}))
);

async function change() {
    changing.value = !changing.value;
    if (changing.value) triggers.value = (await api.all("trigger")).filter((t) => !t.completed && !t.deleted);
}
const actions = computed(() => Object.entries(MOMENTS).map(([value, label]) => ({value, label, current: chosenAction.value === value})));

function save(value) {
    return api.act("sequence", props.resource.n, "set", {key: "starts_on", value});
}
</script>

<template>
    <section :class="['starts', {bare}]">
        <template v-if="!bare">
            <h3>When it starts</h3>
        </template>
        <div class="starts-line">
            <span>{{ sentence }}</span>
            <template v-if="!resource.data.system">
                <Btn small @click="change">{{ changing ? "Done" : "Change" }}</Btn>
            </template>
        </div>
        <template v-if="changing">
            <span class="starts-label">What starts it</span>
            <ChoiceList :choices="kinds" @pick="(type) => save(type === BY_HAND ? BY_HAND : `${type}.${chosenAction}`)" />
            <template v-if="firing.length">
                <span class="starts-label">Or when a trigger fires</span>
                <ChoiceList :choices="firing" @pick="save" />
            </template>
            <template v-if="moment !== BY_HAND && !fired">
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

.starts.bare {
    margin-top: 0;
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
