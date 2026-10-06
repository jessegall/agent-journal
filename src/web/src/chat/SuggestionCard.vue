<script setup>
import {computed, inject, nextTick, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import SuggestionChange from "./SuggestionChange.vue";
import SuggestionChoices from "./SuggestionChoices.vue";
import SuggestionOutcome from "./SuggestionOutcome.vue";
import {
    FROM_JOURNAL,
    NO,
    YES,
    choicesFor,
    failure,
    fromWhom,
    isOpen,
    outcomeOf,
    phaseOf,
    pinned,
    spokenFor,
} from "../domain/suggestions.js";

const props = defineProps({
    suggestion: {type: Object, required: true},
    bare: Boolean,
    briefless: Boolean,
    phone: Boolean,
    escNote: Boolean,
});
const emit = defineEmits(["acted", "writing"]);
const acts = inject("suggestionActs");
const busy = ref("");
const installError = ref("");
const saveError = ref("");
const changing = ref(false);
const words = ref("");
const card = ref(null);
const s = computed(() => props.suggestion);
const source = computed(() => s.value.data.plugin || "");
const commit = computed(() => pinned(s.value));
const phase = computed(() => {
    if (busy.value === "install") return "installing";
    if (installError.value && !s.value.completed) return "failed";
    return phaseOf(s.value);
});
const open = computed(() => isOpen(phase.value));
const choices = computed(() => choicesFor(s.value, phase.value));
const outcome = computed(() => outcomeOf(s.value, phase.value, failure(s.value) || installError.value));
const boxId = computed(() => `suggestion-change-${s.value.n}-${props.bare ? "window" : "chat"}`);

watch(words, (text) => emit("writing", Boolean(text.trim())));
watch(phase, (now) => acts.speak(spokenFor(s.value, now)));

const toTitle = () =>
    nextTick(() => {
        const heading = card.value?.closest("[role=dialog]")?.querySelector("h3") || card.value?.querySelector(".sg-title");
        heading?.focus({preventScroll: true});
    });

async function run(kind, work) {
    if (busy.value) return;
    emit("acted");
    busy.value = kind;
    saveError.value = "";
    try {
        await work();
    } catch (e) {
        if (kind === "install") installError.value = e.message;
        else saveError.value = e.message;
    }
    busy.value = "";
    toTitle();
}

const install = () => {
    installError.value = "";
    return run("install", () => acts.install(s.value.n));
};
const decide = (kind, how) => run(kind, () => acts.complete(s.value.n, how));

function startChange() {
    emit("acted");
    changing.value = true;
    nextTick(() => card.value?.querySelector("textarea")?.focus());
}

function cancelChange() {
    changing.value = false;
    words.value = "";
    toTitle();
}

async function addChange() {
    const text = words.value.trim();
    if (!text) return;
    await decide("change", text);
    if (saveError.value) return;
    changing.value = false;
    words.value = "";
}

async function sayNo() {
    await decide("no", NO);
    if (!saveError.value) acts.offerUndo(s.value.n);
}

const ACTS = {yes: () => (source.value ? install() : decide("yes", YES)), change: startChange, no: sayNo};
const press = (choice) => ACTS[choice.act]();
</script>

<template>
    <article ref="card" :class="['sg', {phone, bare, settled: !open && !changing}]" :data-card="s.n">
        <template v-if="!bare">
            <div class="sg-eyebrow">
                <Icon name="bulb" />
                <span>Suggestion {{ s.n }}</span>
                <span class="from" :title="source ? FROM_JOURNAL : undefined" :tabindex="source ? 0 : undefined">{{ fromWhom(s) }}</span>
            </div>
            <p class="sg-title" tabindex="-1">{{ s.title }}</p>
        </template>
        <template v-if="source && (open || changing)">
            <p class="sg-from">
                <Icon name="plug" />
                <span>
                    From
                    <code>{{ source }}</code>
                    <template v-if="commit">
                        at
                        <code>{{ commit }}</code>
                    </template>
                </span>
            </p>
        </template>
        <template v-if="(open || changing) && !briefless">
            <TextDisplay class="sg-brief" :text="s.brief" />
        </template>
        <template v-if="changing">
            <SuggestionChange
                :id="boxId"
                v-model="words"
                :plugin="Boolean(source)"
                :esc-note="escNote"
                :busy="Boolean(busy)"
                :phone="phone"
                @add="addChange"
                @cancel="cancelChange"
            />
        </template>
        <template v-else>
            <template v-if="outcome">
                <SuggestionOutcome :outcome="outcome" :phone="phone" @open="acts.open" />
            </template>
            <template v-if="open">
                <SuggestionChoices :choices="choices" :busy="busy" :phone="phone" @press="press" />
            </template>
            <template v-if="saveError">
                <p class="sg-error" role="alert">Your answer was not saved: {{ saveError }}. Try again.</p>
            </template>
        </template>
    </article>
</template>

<style scoped>
.sg {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 12px 12px;
    border: 1px solid color-mix(in srgb, var(--blocking) 30%, var(--border-2));
    border-radius: 9px;
    background: var(--raised);
}

.sg.settled {
    border-color: var(--border-2);
}

.sg.bare {
    padding: 0;
    border: 0;
    background: none;
}

.sg-eyebrow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 6px;
    margin-bottom: 5px;
    color: var(--blocking);
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.sg-eyebrow .from {
    color: var(--text-4);
    letter-spacing: 0;
    text-transform: none;
}

.sg-eyebrow .from[title] {
    border-bottom: 1px dotted var(--text-4);
    cursor: help;
}

.sg.settled .sg-eyebrow {
    color: var(--text-3);
}

.sg-title {
    margin: 0;
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.4;
    outline: none;
}

.sg-from {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 11.5px;
}

.sg-from :deep(svg) {
    flex: none;
    margin-top: 1px;
    color: var(--accent-text);
}

.sg-from code {
    color: var(--text);
    font: 11px var(--mono);
    overflow-wrap: anywhere;
}

.sg-brief {
    margin: 4px 0 0;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
}

.sg-error {
    margin: 8px 0 0;
    color: var(--danger);
    font-size: 11.5px;
}

.sg.phone {
    display: flex;
    flex-direction: column;
    padding: 14px;
    border-radius: 12px;
}

.sg.phone.bare {
    padding: 0;
}

.sg.phone .sg-eyebrow {
    font-size: 0.735em;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
}

.sg.phone .sg-title {
    font-size: 1em;
    font-weight: 600;
}

.sg.phone .sg-brief {
    font-size: 0.882em;
    line-height: 1.4;
}

.sg.phone .sg-from {
    font-size: 0.765em;
}
</style>
