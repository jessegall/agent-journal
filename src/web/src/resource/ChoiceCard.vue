<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {choiceGroups, doing, liveButtons, pressedLabels, spent as usedUp} from "../domain/buttons.js";
import {rows} from "../sync/rows.js";
import Btn from "../kit/Btn.vue";
import ChoiceChosen from "./ChoiceChosen.vue";
import Spinner from "../kit/Spinner.vue";

const props = defineProps({resource: Object});
const running = ref("");
const error = ref("");
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
const done = computed(() => pressed.value.filter((label) => !groups.value.some((g) => g.buttons.some((b) => b.label === label))));
const means = (button) => (button.say ? `Sends as your message: “${button.say}”` : `Runs: ${doing(button)}`);

async function press(button) {
    if (running.value || spent(button)) return;
    running.value = button.label;
    error.value = "";
    try {
        if (button.say) await api.create("message", {brief: button.say, about: `${props.resource.type}:${props.resource.n}`});
        else if (button.n) await api.act(button.type, button.n, button.action, button.body || {});
        else await api.command(button.type, button.action, button.body || {});
        await api.act(props.resource.type, props.resource.n, "set", {
            key: "pressed",
            value: [...new Set([...pressed.value, button.label])],
        });
    } catch (e) {
        error.value = e.message;
    }
    running.value = "";
}
</script>

<template>
    <template v-if="groups.length || alone.length || done.length">
        <div class="choice">
            <template v-for="group in groups" :key="group.choice">
                <section class="card">
                    <span class="kind">Your answer</span>
                    <template v-if="group.answer">
                        <ChoiceChosen :answer="group.answer" />
                    </template>
                    <template v-else>
                        <p class="ask">{{ group.ask }}</p>
                        <div class="answers">
                            <div class="buttons">
                                <template v-for="(button, i) in group.buttons" :key="button.label">
                                    <button
                                        type="button"
                                        :class="['answer', {first: i === 0}]"
                                        :disabled="Boolean(running)"
                                        @click="press(button)"
                                    >
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
                            <p class="note">Choose one of these. The others go away once you choose.</p>
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
                                :title="means(button)"
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
            <template v-if="done.length">
                <p class="note">You pressed {{ done.join(", ") }}.</p>
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

.answer.first {
    border-color: var(--accent);
}

.answer:hover:not(:disabled) {
    border-color: var(--accent);
    background: var(--hover);
}

.answer-label {
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
