<script setup>
import {ref} from "vue";

const props = defineProps({queue: {type: Object, required: true}, read: {type: Function, required: true}});
const emit = defineEmits(["saved"]);
const saving = ref(false);
const failure = ref("");

async function save(key, value) {
    if (saving.value) return;
    saving.value = true;
    const answer = await props.read(["setting", "set", key, String(value)]);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("saved");
    saving.value = false;
}
</script>

<template>
    <div class="controls" data-queue-controls>
        <div class="counts">
            <div>
                <strong data-queue-spots>
                    {{ queue.used_slots }}
                    <span>/ {{ queue.parallel_limit }}</span>
                </strong>
                <p>Spots in use</p>
            </div>
            <div>
                <strong data-queue-waiting>{{ queue.waiting_count }}</strong>
                <p>Waiting</p>
            </div>
            <div class="limit">
                <label id="queue-limit-label">Runs at once</label>
                <div class="stepper">
                    <button
                        type="button"
                        aria-label="Fewer runs at once"
                        :disabled="saving || queue.parallel_limit <= 1"
                        @click="save(queue.limit_setting, queue.parallel_limit - 1)"
                    >
                        −
                    </button>
                    <output aria-labelledby="queue-limit-label" data-queue-limit>{{ queue.parallel_limit }}</output>
                    <button
                        type="button"
                        aria-label="More runs at once"
                        :disabled="saving"
                        @click="save(queue.limit_setting, queue.parallel_limit + 1)"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
        <div class="main-spots">
            <div>
                <label id="main-spots-label">Main agent runs take spots</label>
                <p>Count the main agent’s runs toward the limit.</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-labelledby="main-spots-label"
                :aria-checked="queue.count_main_runs"
                :disabled="saving"
                data-queue-main-spots
                @click="save(queue.main_spots_setting, queue.count_main_runs ? 'off' : 'on')"
            >
                <span />
            </button>
        </div>
        <template v-if="queue.halted">
            <p class="halted" role="status" data-queue-held>Queue paused: {{ queue.halt_reason }}</p>
        </template>
        <template v-if="failure">
            <p class="failure" role="alert">{{ failure }}</p>
        </template>
    </div>
</template>

<style scoped>
.controls {
    padding: 20px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
}
.counts {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 32px;
}
strong {
    color: var(--text);
    font-size: 28px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.04em;
}
strong span {
    color: var(--text-4);
    font-size: 18px;
    font-weight: 400;
}
p {
    margin: 5px 0 0;
    color: var(--text-3);
    font-size: 11px;
}
.limit {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-left: auto;
}
label {
    color: var(--text-2);
    font-size: 12px;
}
.stepper {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 7px;
}
.stepper button {
    width: 30px;
    height: 29px;
    border: 0;
    background: transparent;
    color: var(--text-3);
    font-size: 16px;
    cursor: pointer;
}
.stepper output {
    min-width: 28px;
    text-align: center;
    color: var(--text);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}
.main-spots {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
}
.main-spots > div {
    flex: 1;
}
[role="switch"] {
    display: flex;
    align-items: center;
    width: 30px;
    height: 18px;
    padding: 3px;
    border: 0;
    border-radius: 20px;
    background: var(--border-2);
    cursor: pointer;
}
[role="switch"] span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--text-3);
}
[role="switch"][aria-checked="true"] {
    background: var(--accent);
}
[role="switch"][aria-checked="true"] span {
    margin-left: auto;
    background: white;
}
button:disabled {
    opacity: 0.45;
    cursor: default;
}
.held {
    margin-top: 16px;
    color: var(--tone-warn, var(--text-2));
}
.failure {
    color: var(--danger);
}
</style>
