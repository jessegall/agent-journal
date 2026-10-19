<script setup>
import {store} from "../state/store.js";
import TextInput from "../kit/TextInput.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import OptionList from "../kit/OptionList.vue";
import {sendMessage} from "../chat/outbox.js";
import {answer, answered} from "../chat/answers.js";
import {route} from "../route.js";

const props = defineProps({question: Object, buttonsOnly: Boolean, immediate: Boolean, tiles: Boolean, steady: Boolean});
const emit = defineEmits(["elaborated"]);
const shown = computed(() => answered(props.question));
const own = ref("");
const elaborated = ref(false);
const options = computed(() => (props.question.options || []).map((title) => ({title, description: "", code: ""})));
const settled = computed(() => shown.value.answer != null);
const chosen = computed(() => options.value.findIndex((o) => o.title === shown.value.answer));
const ownWords = computed(() => settled.value && chosen.value < 0);
const elaborateText = () => `Elaborate on question ${props.question.id}: ask it again with more context on each option and which you would pick, and you choose.`;

function submit(text) {
    const choice = String(text || "").trim();
    if (!choice) return Promise.resolve();
    own.value = "";
    return answer(props.question, choice);
}

async function elaborate() {
    elaborated.value = true;
    emit("elaborated");
    try {
        await sendMessage(route.value.env, {text: elaborateText()});
    } catch (e) {
        elaborated.value = false;
    }
}

const holdSeconds = computed(() => store.settings?.ask_questions?.hold);
</script>

<template>
    <section class="options">
        <OptionList
            :options="options"
            :chosen="settled && chosen >= 0 ? options[chosen].title : ''"
            chosen-by=""
            reason=""
            :suggested="-1"
            :disabled="settled"
            :immediate="immediate"
            :tiles="tiles"
            :steady="steady"
            :multiple="false"
            :chosen-many="[]"
            :hold-seconds="holdSeconds"
            :send="(choice) => submit([choice].flat().join('; '))"
        />
        <template v-if="shown.unsaved">
            <p class="unsaved">
                Couldn't save “{{ shown.unsaved }}” ·
                <button type="button" @click="submit(shown.unsaved)">Try again</button>
            </p>
        </template>
        <template v-if="settled && !steady">
            <template v-if="ownWords">
                <div class="own-words">
                    <span>Your own words</span>
                    <TextDisplay inline class="own-words-text" :text="shown.answer" />
                </div>
            </template>
        </template>
        <template v-else-if="!settled && !buttonsOnly">
            <form class="own" @submit.prevent="submit(own)">
                <TextInput :value="own" class="grow" placeholder="Or answer in your own words…" @input="own = $event.target.value">
                    <template #end>
                        <Btn small :disabled="elaborated" v-tip="'Ask the agent for more context on this question'" @click="elaborate">
                            {{ elaborated ? "Asked to elaborate" : "Elaborate" }}
                        </Btn>
                        <Btn kind="primary" small @click="submit(own)">Answer</Btn>
                    </template>
                </TextInput>
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
