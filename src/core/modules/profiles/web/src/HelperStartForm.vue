<script setup>
import {computed, onMounted, ref} from "vue";
import {Btn, useWindow} from "@journal/window-kit";

// the Start a helper form of one helper profile, closed with the reason when no helper can start
const props = defineProps({profile: {type: String, required: true}});
const context = useWindow();
const availability = ref({reason: "", programs: []});
const brief = ref("");
const program = ref("");
const notice = ref("");
const blocked = computed(() => Boolean(availability.value.reason) || !brief.value.trim());

async function load() {
    const answer = await context.read("helper availability");
    if (answer.ok) availability.value = answer.value;
}

async function start() {
    const line = ["helper", "start", props.profile, "--brief", brief.value, ...(program.value ? ["--program", program.value] : [])];
    const result = await context.run(line);
    notice.value = result.ok ? "The helper is starting." : result.error;
    if (result.ok) brief.value = "";
    await load();
}

onMounted(load);
</script>

<template>
    <form class="helper-start" data-helper-start @submit.prevent="start">
        <label class="field">
            <span>The job</span>
            <textarea v-model="brief" rows="3" data-helper-brief></textarea>
        </label>
        <label class="field">
            <span>Program</span>
            <select v-model="program" data-helper-program>
                <option value="">The profile's program</option>
                <template v-for="name in availability.programs" :key="name"><option :value="name">{{ name }}</option></template>
            </select>
        </label>
        <Btn type="submit" :disabled="blocked" data-helper-start-button>Start a helper</Btn>
        <template v-if="availability.reason"><p class="reason" data-helper-start-reason>{{ availability.reason }}</p></template>
        <template v-if="notice"><p class="notice">{{ notice }}</p></template>
    </form>
</template>

<style scoped>
.helper-start { display: grid; gap: 8px; margin-top: 12px; }
.field { display: grid; gap: 4px; }
.reason, .notice { margin: 0; }
</style>
