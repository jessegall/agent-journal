<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {allButtons, choiceGroups, doing, liveButtons, pressedLabels, spent as usedUp} from "../domain/buttons.js";
import {rows} from "../sync/rows.js";
import Btn from "../kit/Btn.vue";
import PickTag from "../kit/PickTag.vue";
import ChoiceChosen from "./ChoiceChosen.vue";
import Spinner from "../kit/Spinner.vue";
import TextArea from "../kit/TextArea.vue";
import {useHeldSend} from "../composables/heldSend.js";
import {usePressing} from "../composables/pressing.js";

const OWN_WORDS = "own words";
const props = defineProps({resource: Object, preview: Boolean});
const {pressing: running, failure: error, run} = usePressing();
const writing = ref(false);
const own = ref("");
const written = ref([]);
const card = ref(null);
const flashing = ref(false);
const held = useHeldSend({seconds: () => 5, send: (item) => (item.button ? commitPress(item.button) : commitOwn(item.text))});
const ownAnswer = computed(() => props.resource.data.answered_own || "");
const pressed = computed(() => pressedLabels(props.resource));
const spent = (button) => usedUp(props.resource, button);
const sentAs = (button) => rows("message").find((m) => m.refs.includes(props.resource.ref) && [m.title, m.brief].includes(button.say));
const answered = (group) => ({
    label: group.chosen.label,
    say: group.chosen.say,
    sent: sentAs(group.chosen),
    result: means(group.chosen)
        .replace(/^Sends/, "Sent")
        .replace(/^Runs/, "Ran"),
    passed: group.buttons.filter((b) => b !== group.chosen).map((b) => b.label),
});
const groups = computed(() => choiceGroups(props.resource).map((group) => ({...group, answer: group.chosen && answered(group)})));
const alone = computed(() => liveButtons(props.resource).filter((b) => !b.choice));
const outcome = (button) => {
    if (button.outcome) return `${button.outcome}.`;
    if (!button.say) return `Ran: ${doing(button)}.`;
    const sent = sentAs(button);
    return `Sent as your message${sent ? ` ${sent.n}` : ""}: “${button.say}”. The answer comes in the chat.`;
};
const open = computed(() => !ownAnswer.value && (groups.value.some((group) => !group.chosen) || alone.value.length > 0));
const done = computed(() =>
    allButtons(props.resource)
        .filter((button) => !button.choice && pressed.value.includes(button.label))
        .map(outcome)
);
const means = (button) => (button.say ? `Sends as your message: “${button.say}”` : `Runs: ${doing(button)}`);

function show() {
    card.value?.scrollIntoView({behavior: "smooth", block: "center"});
    flashing.value = true;
    setTimeout(() => (flashing.value = false), 1600);
}

defineExpose({show});

async function commitOwn(text) {
    if (!text) return;
    await run(OWN_WORDS, async () => {
        const sent = await api.create("message", {brief: text, about: props.resource.ref});
        if (props.resource.type === "doc")
            await api.act("doc", props.resource.n, "update", {status: "final", answered_own: text, answered_message: sent.n});
        else await api.act(props.resource.type, props.resource.n, "set", {key: "answered_own", value: text});
        written.value.push(`Sent as your message ${sent.n}: “${text}”. The answer comes in the chat.`);
        own.value = "";
        writing.value = false;
    });
}

function sendOwn() {
    const text = own.value.trim();
    if (!text) return;
    if (props.resource.type === "doc") held.start({text});
    else commitOwn(text);
}

async function commitPress(button) {
    if (spent(button)) return;
    await run(button.label, async () => {
        if (button.say) await api.create("message", {brief: button.say, about: `${props.resource.type}:${props.resource.n}`});
        else await api.press(button);
        const chosen = [...new Set([...pressed.value, button.label])];
        if (props.resource.type === "doc") {
            const updated = {...props.resource, data: {...props.resource.data, pressed: chosen}};
            await api.act("doc", props.resource.n, "update", {
                pressed: chosen,
                status: choiceGroups(updated).every((group) => group.chosen) ? "final" : "draft",
            });
        } else await api.act(props.resource.type, props.resource.n, "set", {key: "pressed", value: chosen});
    });
}

function press(button) {
    if (props.resource.type === "doc" && button.choice) held.start({button});
    else commitPress(button);
}
</script>

<template>
    <template v-if="groups.length || alone.length || done.length">
        <div :class="['choice', {flash: flashing}]" ref="card">
            <template v-if="ownAnswer">
                <div class="card">
                    <span class="kind">Your answer</span>
                    <p class="ask">{{ ownAnswer }}</p>
                    <p class="note">Sent as your message {{ resource.data.answered_message }}. This document is final now.</p>
                </div>
            </template>
            <template v-if="held.holding.value">
                <div class="card held" aria-live="polite">
                    <strong>{{ held.value.value.button?.label || held.value.value.text }}</strong>
                    <span>Sending in {{ held.left.value }} seconds</span>
                    <Btn small @click="held.undo">Undo</Btn>
                </div>
            </template>
            <template v-for="group in ownAnswer ? [] : groups" :key="group.choice">
                <section class="card">
                    <span class="kind">
                        {{ group.answer ? "Your answer" : /approv/i.test(group.ask) ? "Your approval is needed" : "Your answer is needed" }}
                    </span>
                    <template v-if="group.answer">
                        <ChoiceChosen :answer="group.answer" :about="resource" />
                    </template>
                    <template v-else>
                        <p class="ask">{{ group.ask }}</p>
                        <div v-show="!held.holding.value" class="answers">
                            <div class="buttons">
                                <template v-for="button in group.buttons" :key="button.label">
                                    <button type="button" class="answer" :disabled="Boolean(running)" @click="press(button)">
                                        <template v-if="button === group.pick">
                                            <PickTag class="answer-pick">Recommended</PickTag>
                                        </template>
                                        <span class="answer-label">
                                            <template v-if="running === button.label">
                                                <Spinner />
                                            </template>
                                            {{ button.label }}
                                        </span>
                                        <span class="answer-note">{{ means(button) }}</span>
                                    </button>
                                </template>
                            </div>
                            <p class="note">Choose one.</p>
                        </div>
                    </template>
                </section>
            </template>
            <template v-if="alone.length">
                <div class="alone">
                    <template v-if="groups.length">
                        <span class="note">Also on this {{ resource.type }}</span>
                    </template>
                    <div class="row">
                        <template v-for="(button, i) in alone" :key="button.label">
                            <Btn
                                small
                                :kind="i === 0 && !groups.length && !pressed.length ? 'primary' : 'ghost'"
                                :disabled="Boolean(running)"
                                v-tip="means(button)"
                                @click="press(button)"
                            >
                                <template v-if="running === button.label">
                                    <Spinner />
                                </template>
                                {{ button.label }}
                            </Btn>
                            <template v-if="button.again">
                                <span class="note">{{ means(button) }}. It stays: you can press it again.</span>
                            </template>
                        </template>
                    </div>
                </div>
            </template>
            <template v-if="open && !held.holding.value">
                <div class="own">
                    <template v-if="writing">
                        <TextArea
                            :value="own"
                            @input="own = $event.target.value"
                            placeholder="Write your answer"
                            rows="3"
                            autofocus
                            @keydown.esc="writing = false"
                        />
                        <div class="row">
                            <Btn small kind="primary" :disabled="!own.trim() || Boolean(running)" @click="sendOwn">Send</Btn>
                            <Btn small @click="writing = false">Cancel</Btn>
                        </div>
                    </template>
                    <template v-else>
                        <Btn small kind="text" @click="writing = true">Answer in your own words</Btn>
                    </template>
                </div>
            </template>
            <template v-for="line in [...done, ...written]" :key="line">
                <p class="note">{{ line }}</p>
            </template>
            <template v-if="error">
                <p class="error">{{ error }}</p>
            </template>
        </div>
    </template>
</template>

<style scoped>
.choice {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
}

.kind {
    color: var(--text-3);
    font-size: 11.5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.ask {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
}

.answers {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg-2);
}

.buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 8px;
}

.answer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.answer:hover:not(:disabled) {
    border-color: var(--accent);
    background: var(--hover);
}

.answer-pick {
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 10px;
}

.answer-label {
    min-width: 0;
    white-space: normal;
    overflow-wrap: anywhere;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
}

.answer-note,
.note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.own {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.own :deep(.text-area) {
    width: 100%;
}

.own .row {
    display: flex;
    gap: 6px;
}

.choice.flash {
    border-radius: 12px;
    animation: flash 1.6s ease-out;
}

@keyframes flash {
    from {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 55%, transparent);
    }

    to {
        box-shadow: 0 0 0 3px transparent;
    }
}

.alone .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 11.5px;
}
</style>
