<script setup>
import {computed, ref, watch} from "vue";
import {Btn, TextArea, TextInput, useWindow} from "@journal/window-kit";

const props = defineProps({profile: {type: String, required: true}});
const context = useWindow();
const UNAVAILABLE = {can_start: false, reason: "", programs: [], idle_helpers: [], can_start_fresh: false, fresh_reason: ""};
const availability = ref(UNAVAILABLE);
const brief = ref("");
const program = ref("");
const notice = ref("");
const freshReason = ref("");
const pending = ref(false);
const loading = ref(true);
let latestRequest = 0;
const canSend = computed(() => !pending.value && !loading.value && Boolean(brief.value.trim()));
const blocked = computed(() => !canSend.value || !(availability.value.can_start || (availability.value.can_start_fresh && freshReason.value.trim())));

async function load() {
    const request = ++latestRequest;
    loading.value = true;
    const answer = await context.read(`helper availability --profile ${props.profile}${program.value ? ` --program ${program.value}` : ""}`);
    if (request !== latestRequest) return;
    if (answer.ok) availability.value = answer.value;
    else {
        availability.value = UNAVAILABLE;
        notice.value = answer.error;
    }
    loading.value = false;
}

async function start() {
    if (blocked.value) return;
    await run(["helper", "start", props.profile, "--brief", brief.value, ...(program.value ? ["--program", program.value] : []), ...(freshReason.value.trim() ? ["--fresh", freshReason.value.trim()] : [])], "The helper is starting.");
}

async function send(helper) {
    if (!canSend.value) return;
    await run(["helper", "send", String(helper), brief.value], "Job sent.");
}

async function run(line, success) {
    pending.value = true;
    try {
        const result = await context.run(line);
        notice.value = result.ok ? success : result.error;
        if (result.ok) {
            brief.value = "";
            freshReason.value = "";
        }
        await load();
    } finally {
        pending.value = false;
    }
}

watch([() => props.profile, program], load, {immediate: true});
</script>

<template>
    <form class="helper-start" data-helper-start @submit.prevent="start">
        <h3>Give a helper a job</h3>
        <label class="field">
            <span>The job</span>
            <TextArea :value="brief" rows="3" :disabled="pending" data-helper-brief @input="brief = $event.target.value" />
        </label>
        <label class="field">
            <span>Program</span>
            <select v-model="program" :disabled="pending" data-helper-program>
                <option value="">The profile's program</option>
                <template v-for="name in availability.programs" :key="name"><option :value="name">{{ name }}</option></template>
            </select>
        </label>
        <div v-for="helper in availability.idle_helpers" :key="helper.id" class="idle-helper" :data-helper-idle="helper.id">
            <span>{{ helper.name }} · Idle</span>
            <Btn type="button" :disabled="!canSend" :data-helper-send="helper.id" @click="send(helper.id)">Send the job</Btn>
        </div>
        <label v-if="availability.idle_helpers.length" class="field">
            <span>Why start another helper?</span>
            <TextInput v-model="freshReason" :disabled="pending" data-helper-fresh-reason />
        </label>
        <Btn type="submit" :disabled="blocked" data-helper-start-button>Start a helper</Btn>
        <p v-if="availability.fresh_reason" class="reason" data-helper-fresh-blocked>{{ availability.fresh_reason }}</p>
        <template v-if="availability.reason && availability.reason !== availability.fresh_reason"><p class="reason" data-helper-start-reason>{{ availability.reason }}</p></template>
        <template v-if="notice"><p class="notice">{{ notice }}</p></template>
    </form>
</template>

<style scoped>
.helper-start { display: grid; gap: 12px; padding: 0 0 20px; margin-bottom: 20px; border-bottom: 1px solid var(--border-2); }
h3 { margin: 0; font-size: 14px; font-weight: 600; }
.field { display: grid; gap: 4px; }
.field > span { color: var(--text-2); font-size: 12px; font-weight: 500; }
select { padding: 6px 9px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); color: var(--text); font: inherit; }
.reason, .notice { margin: 0; color: var(--text-3); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.idle-helper { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
</style>
