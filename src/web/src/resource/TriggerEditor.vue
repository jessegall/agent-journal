<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {DOES, WHERE, doesOf, doesReason, plain, sentence, startedBy, whereReason} from "../domain/triggerWords.js";
import {open} from "../domain/records.js";
import {ago} from "../format/time.js";
import Btn from "../kit/Btn.vue";
import Caution from "../kit/Caution.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import FormField from "../kit/FormField.vue";
import InlineName from "../kit/InlineName.vue";
import Notice from "../kit/Notice.vue";
import TextArea from "../kit/TextArea.vue";
import ResourceBlock from "./ResourceBlock.vue";
import TriggerSequences from "./TriggerSequences.vue";
import WatchedWords from "./WatchedWords.vue";

const props = defineProps({resource: {type: Object, default: null}, draft: {type: Object, default: null}});
const error = ref("");
const leaving = ref("");
const renamed = ref(0);
const when = ref(null);

const n = computed(() => props.resource?.n || 0);
const values = computed(() => props.draft || {title: props.resource.title, ...props.resource.data});
const readonly = computed(() => Boolean(values.value.system));
const sequences = computed(() =>
    n.value ? startedBy(n.value) : open("sequence").filter((s) => (props.draft.sequences || []).includes(s.n))
);
const parts = computed(() => sentence(values.value, sequences.value));
const titles = computed(() => sequences.value.map((s) => s.title).join(", "));
const consequence = computed(() => {
    const [it, them] = sequences.value.length === 1 ? ["it", "it"] : ["they", "them"];
    return `. If the trigger does something else, ${it} will start only when you or the agent start ${them}.`;
});
const matches = computed(() => {
    const {matched = 0, matched_at: last} = values.value;
    if (!matched) return "Never matched yet";
    return matched === 1 ? `Matched once, ${ago(last)}` : `Matched ${matched} times, last ${ago(last)}`;
});
const does = computed(() => doesOf(values.value.does));
const choices = (options, current, unavailable) =>
    options.map((option) => ({...option, current: option.value === current, unavailable: readonly.value ? "" : unavailable[option.value]}));

async function commit(patch) {
    error.value = "";
    if (props.draft) return Object.assign(props.draft, patch);
    try {
        const next = {...values.value, ...patch};
        await api.act("trigger", n.value, "update", {...patch, brief: plain(sentence(next, sequences.value))});
    } catch (e) {
        error.value = e.message;
    }
}

function pickDoes(value) {
    if (value !== "start" && values.value.does === "start" && n.value && sequences.value.length) leaving.value = value;
    else commit({does: value});
}

async function change() {
    const value = leaving.value;
    leaving.value = "";
    await Promise.all(sequences.value.map((s) => api.setStartsOn(s.n, "")));
    await commit({does: value});
}

function rename(title) {
    renamed.value++;
    if (title !== values.value.title) commit({title});
}
const towhere = () => when.value.$el.scrollIntoView({behavior: "smooth", block: "center"});
</script>

<template>
    <div class="trigger">
        <template v-if="readonly">
            <Notice>Comes with the journal. You can read it and open its sequence, but not change it.</Notice>
        </template>
        <template v-else>
            <InlineName
                :key="renamed"
                class="name"
                :select="false"
                :value="values.title"
                placeholder="Name it, for example: No force push"
                @done="rename"
                @cancel="renamed++"
            />
        </template>
        <slot name="examples" />
        <div class="sum">
            <span class="sum-kind">What it does</span>
            <p class="sum-text">
                <template v-for="part in parts" :key="part.key">
                    <template v-if="part.bold">
                        <b>{{ part.text }}</b>
                    </template>
                    <template v-else-if="part.muted">
                        <i>{{ part.text }}</i>
                    </template>
                    <template v-else>{{ part.text }}</template>
                </template>
            </p>
            <template v-if="n">
                <span class="sum-matched">{{ matches }}</span>
            </template>
        </div>
        <ResourceBlock heading="When these words appear">
            <WatchedWords
                ref="when"
                :words="values.words || []"
                :words-in="values.words_in || 'both'"
                :scopes="WHERE"
                :unavailable="whereReason(values)"
                :readonly="readonly"
                @words="(words) => commit({words})"
                @where="(words_in) => commit({words_in})"
            />
        </ResourceBlock>
        <ResourceBlock heading="What happens next">
            <div class="then">
                <FormField label="What this trigger does">
                    <ChoiceList stacked :choices="choices(DOES, values.does, doesReason(values))" :disabled="readonly" @pick="pickDoes" />
                    <template v-if="!readonly && values.words_in === 'user'">
                        <p class="help">
                            Blocking works on the agent's actions, not on your messages.
                            <Btn small @click="towhere">Change what triggers it</Btn>
                        </p>
                    </template>
                </FormField>
                <template v-if="leaving">
                    <Caution>
                        {{ sequences.length === 1 ? "1 sequence starts" : `${sequences.length} sequences start` }} on this trigger:
                        <b>{{ titles }}</b>
                        {{ consequence }}
                        <template #actions>
                            <Btn small @click="leaving = ''">Keep “Start a sequence”</Btn>
                            <Btn small kind="primary" @click="change">Change it</Btn>
                        </template>
                    </Caution>
                </template>
                <template v-if="values.does === 'start'">
                    <TriggerSequences
                        :n="n"
                        :chosen="draft?.sequences || []"
                        :readonly="readonly"
                        @update:chosen="(list) => commit({sequences: list})"
                    />
                </template>
                <template v-else>
                    <FormField :label="does.ask" :help="values.does === 'message' ? 'It reaches the chat as if you had typed it.' : ''">
                        <TextArea
                            :value="values.text || ''"
                            :disabled="readonly"
                            :placeholder="does.example"
                            @change="commit({text: $event.target.value})"
                        />
                    </FormField>
                </template>
            </div>
        </ResourceBlock>
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
    </div>
</template>

<style scoped>
.trigger {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 12px;
}

.name {
    flex: none;
}

.name :deep(.inline-name-field) {
    padding: 4px 6px;
    border-color: transparent;
    background: none;
    font-size: 19px;
    font-weight: 600;
}

.name :deep(.inline-name-field:hover) {
    border-color: var(--border-2);
}

.name :deep(.inline-name-field:focus) {
    border-color: var(--accent);
    background: var(--bg-2);
}

.sum {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
}

.sum-kind {
    color: var(--text-3);
    font-size: 11.5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.sum-text {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    line-height: 1.55;
}

.sum-matched {
    color: var(--text-3);
    font-size: 12px;
}

.sum-text i {
    color: var(--text-3);
}

.then {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.help {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}
</style>
