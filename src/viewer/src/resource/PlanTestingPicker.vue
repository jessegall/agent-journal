<script setup>
import {computed, onMounted, ref} from "vue";
import {useScope} from "../composables/scope.js";
import Btn from "../kit/Btn.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import Dialog from "../kit/Dialog.vue";

const NONE = "none";
const props = defineProps({plan: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const scope = useScope();
const templates = ref([]);
const picking = ref("");
const failure = ref("");

const current = computed(() => props.plan.testing?.[0] || NONE);
const choices = computed(() => [
    {value: NONE, label: "No testing template", hint: "The agent is told nothing about testing.", current: current.value === NONE},
    ...templates.value.map((t) => ({value: t.title, label: t.title, hint: t.brief, current: current.value === t.title})),
]);

onMounted(async () => {
    try {
        templates.value = await scope.api.planTestingTemplates();
    } catch (e) {
        failure.value = e.message;
    }
});

async function pick(title) {
    picking.value = title;
    failure.value = "";
    try {
        await scope.api.setPlanTesting(props.plan.id, title);
        emit("close");
    } catch (e) {
        failure.value = e.message;
    } finally {
        picking.value = "";
    }
}
</script>

<template>
    <Dialog title="How the agent tests" @close="emit('close')">
        <p class="plan">plan {{ plan.id }} · {{ plan.title }}</p>
        <p class="guide">When the plan starts and after each of its tasks, the agent is told how to test in one line.</p>
        <ChoiceList stacked :choices="choices" :busy="(value) => picking === value" @pick="pick" />
        <template v-if="failure">
            <p class="failure">{{ failure }}</p>
        </template>
        <div class="actions">
            <Btn small @click="emit('close')">Close</Btn>
        </div>
    </Dialog>
</template>

<style scoped>
.plan {
    margin: 0 0 8px;
    color: var(--text-2);
}

.guide {
    margin: 0 0 12px;
    color: var(--text-3);
    font-size: 12px;
}

.failure {
    color: var(--danger);
    font-size: 12px;
}

.actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
}
</style>
