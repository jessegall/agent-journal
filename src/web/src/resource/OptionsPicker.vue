<script setup>
import TextInput from "../kit/TextInput.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import OptionList from "../kit/OptionList.vue";
import {word} from "../state/store.js";
import {sendMessage} from "../chat/outbox.js";
import {answer, answered} from "../chat/answers.js";
import {route} from "../route.js";

const props = defineProps({resource: Object, buttonsOnly: Boolean, immediate: Boolean, tiles: Boolean, steady: Boolean});
const emit = defineEmits(["elaborated"]);
const question = computed(() => answered(props.resource));
const own = ref("");
const changing = ref(false);
const elaborated = ref(false);
const capitalised = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const ELABORATE = "Elaborate on this question: ask it again with more context on each option and which you would pick, and I will choose.";
const optionText = (option = {}) => String(option.title || option.label || option.value || "");
const options = computed(() =>
    (Array.isArray(props.resource.data.options) ? props.resource.data.options : []).map((option) => {
        const value = option && typeof option === "object" ? option : {};
        return {
            ...value,
            title: optionText(value),
            description: value.description ?? value.text ?? "",
            code: value.code ?? value.value ?? "",
        };
    })
);
const pick = computed(() => props.resource.data.pick || 0);
const multiple = computed(() => Boolean(props.resource.data.multiple));
const MANY = "; ";
const chosenMany = computed(() => (multiple.value && question.value.completed ? String(question.value.outcome || "").split(MANY) : []));
const settled = computed(() => !!question.value.completed && !changing.value);
const chosen = computed(() =>
    question.value.data.chosen ? question.value.data.chosen - 1 : options.value.findIndex((o) => o.title === question.value.outcome)
);
const ownWords = computed(() => settled.value && chosen.value < 0 && !chosenMany.value.length);

function submit(text) {
    const choice = String(text || "").trim();
    if (!choice) return;
    changing.value = false;
    own.value = "";
    answer(props.resource, choice);
}

async function elaborate() {
    elaborated.value = true;
    emit("elaborated");
    try {
        await sendMessage(route.value.env, {brief: ELABORATE, about: props.resource.ref});
    } catch (e) {
        elaborated.value = false;
    }
}
</script>

<template>
    <section class="options">
        <OptionList
            :options="options"
            :chosen="question.completed && chosen >= 0 ? options[chosen].title : ''"
            :chosen-by="question.data.answered_by || ''"
            :reason="question.data.reason || ''"
            :suggested="pick - 1"
            :disabled="settled"
            :immediate="immediate"
            :tiles="tiles"
            :steady="steady"
            :multiple="multiple"
            :chosen-many="chosenMany"
            @pick="(i) => submit(options[i].title)"
            @picks="(all) => submit(all.map((i) => options[i].title).join(MANY))"
        />
        <template v-if="question.unsaved">
            <p class="unsaved">
                Couldn't save “{{ question.unsaved }}” ·
                <button type="button" @click="submit(question.unsaved)">Try again</button>
            </p>
        </template>
        <template v-if="settled && !steady">
            <template v-if="ownWords">
                <div class="own-words">
                    <span>Your own words</span>
                    <TextDisplay inline class="own-words-text" :text="question.outcome" />
                </div>
            </template>
            <div class="after">
                <Btn small @click="changing = true">Change choice</Btn>
            </div>
        </template>
        <template v-else-if="!buttonsOnly">
            <form class="own" @submit.prevent="submit(own)">
                <TextInput :value="own" class="grow" placeholder="Or choice in your own words…" @input="own = $event.target.value">
                    <template #end>
                        <Btn small :disabled="elaborated" title="Ask the agent for more context on this question" @click="elaborate">
                            {{ elaborated ? "Asked to elaborate" : "Elaborate" }}
                        </Btn>
                        <Btn kind="primary" small @click="submit(own)">{{ capitalised(word(resource.type, "complete")) }}</Btn>
                    </template>
                </TextInput>
                <template v-if="changing">
                    <Btn small @click="changing = false">Keep it</Btn>
                </template>
            </form>
        </template>
    </section>
</template>

<style scoped>
.options {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 12px 0;
}
.unsaved {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}

.unsaved button {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
}

.own-words {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 9px 12px;
    border: 1px solid var(--accent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 12%, var(--raised));
}

.own-words-text {
    color: var(--text-3);
    font-size: 12.5px;
}

.answer {
    display: flex;
    flex-direction: column;
    border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    overflow: hidden;
}

.answer-label {
    padding: 6px 12px;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--accent-text);
}

.answer-text {
    padding: 9px 12px;
    white-space: pre-wrap;
}

.after {
    display: flex;
    justify-content: flex-end;
}

.own {
    display: flex;
    gap: 6px;
}
.grow {
    flex: 1;
}
</style>
