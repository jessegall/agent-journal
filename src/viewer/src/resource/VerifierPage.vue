<script setup>
import {computed, ref} from "vue";
import TranscriptInspector from "../agents/TranscriptInspector.vue";
import {useScope} from "../composables/scope.js";
import {useTranscript} from "../composables/transcript.js";
import {judgedLine, verifierName, verifierWord} from "../domain/verifiers.js";
import {refParts} from "../domain/records.js";
import {ago, clock} from "../format/time.js";
import {seconds} from "../domain/row.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const {env, api} = useScope();
const name = computed(() => verifierName(props.resource));
const state = computed(() => ({icon: "verifier", word: verifierWord(props.resource), since: `since ${ago(seconds(props.resource.updated_at)) || "just now"}`}));
const facts = computed(() => [props.resource.model ? `Runs on ${props.resource.model}` : "", props.resource.session ? `Session ${props.resource.session}` : "", judgedLine(props.resource)].filter(Boolean));
const parts = computed(() => [{key: "brief", title: "Brief", text: props.resource.brief, sub: `its latest judgement, given at ${clock(props.resource.updated_at)}`, none: "No brief"}]);
// the reader reports whose dismissals it judged, newest first
const judged = computed(() => [...(props.resource.judged || [])].reverse().map((ref) => ({ref, ...refParts(ref)})));

// The verifier's own conversation, read from its transcript.
const transcripts = {env: () => api.env(), transcript: (_agent, _session, fields) => api.verifierTranscript(props.resource.id, fields)};
const inspector = ref(null);
const scroller = computed(() => inspector.value && inspector.value.scroller);
const transcript = useTranscript(() => "verifier", "", scroller, transcripts);
const speakers = computed(() => ({agent: name.value, human: "The journal"}));
</script>

<template>
    <TranscriptInspector ref="inspector" :name="name" :state="state" :facts="facts" :parts="parts" :env="env" :transcript="transcript" :speakers="speakers" @close="emit('close')">
        <template #top>Verifiers › {{ name }}</template>
        <template #stamp>
            <span v-for="row in judged" :key="row.ref" class="judged">Reader report {{ row.id }}</span>
        </template>
    </TranscriptInspector>
</template>

<style scoped>
.judged {
    margin-right: 10px;
    color: var(--text-2);
}
</style>
