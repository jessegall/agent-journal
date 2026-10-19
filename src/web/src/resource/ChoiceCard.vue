<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import {allButtons, pressedLabels} from "../domain/buttons.js";
import Btn from "../kit/Btn.vue";
import Spinner from "../kit/Spinner.vue";
import {usePressing} from "../composables/pressing.js";

const props = defineProps({message: Object});
const {pressing: running, failure: error, run} = usePressing();
const pressed = computed(() => pressedLabels(props.message));
const live = computed(() => (pressed.value.length ? [] : allButtons(props.message)));

async function press(button) {
    await run(button.label, async () => {
        await api.press(button);
        await api.pressed(props.message.id, [...pressed.value, button.label]);
    });
}
</script>

<template>
    <template v-if="allButtons(message).length">
        <div class="choice">
            <template v-if="live.length">
                <div class="row">
                    <template v-for="(button, i) in live" :key="button.label">
                        <Btn small :kind="i === 0 ? 'primary' : 'ghost'" :disabled="Boolean(running)" @click="press(button)">
                            <template v-if="running === button.label">
                                <Spinner />
                            </template>
                            {{ button.label }}
                        </Btn>
                    </template>
                </div>
            </template>
            <template v-else>
                <p class="note">You pressed {{ pressed.join(", ") }}.</p>
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
