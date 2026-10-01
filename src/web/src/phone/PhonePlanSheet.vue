<script setup>
import {computed, ref} from "vue";
import PhoneChevron from "./PhoneChevron.vue";
import PhoneSheet from "./PhoneSheet.vue";
import {closed, counted, here, WAITS} from "./planGo.js";

const props = defineProps({plan: {type: Object, required: true}, go: {type: Object, required: true}});
const emit = defineEmits(["close", "read"]);
const waits = computed(() => props.plan.status === WAITS);
const at = computed(() => here(props.plan));
const opened = ref(new Set([at.value]));
const next = computed(() => props.plan.phases[at.value]);
const unfinished = computed(() => (next.value ? next.value.todos.filter((todo) => !todo.done).length : 0));

function toggle(i) {
    const kept = new Set(opened.value);
    if (!kept.delete(i)) kept.add(i);
    opened.value = kept;
}

function tag(i) {
    if (i < at.value) return "Done";
    if (i > at.value) return "Next";
    return waits.value ? "Done, waiting for you" : "Now";
}

const kind = (i) => (i < at.value ? "done" : i > at.value ? "next" : waits.value ? "waits" : "now");
const checkpointAfter = (i) => i === at.value && waits.value && next.value;
</script>

<template>
    <PhoneSheet :label="`Plan ${plan.n}`" tall @close="emit('close')">
        <div class="plan-sheet">
            <header class="plan-sheet-head">
                <span class="plan-sheet-kind">Plan {{ plan.n }}</span>
                <button type="button" class="plan-sheet-full" @click="emit('read', `plan:${plan.n}`)">
                    Full plan
                    <PhoneChevron :size="12" />
                </button>
            </header>
            <h2>{{ plan.title }}</h2>
            <template v-if="plan.abstract">
                <p class="plan-sheet-abstract">{{ plan.abstract }}</p>
            </template>
            <template v-if="waits">
                <section class="plan-sheet-wait">
                    <h3>Waiting for you</h3>
                    <p>
                        Phase {{ at }} is done.
                        <template v-if="next">{{ next.title }} is next, with {{ unfinished }} {{ unfinished === 1 ? "to-do" : "to-dos" }}.</template>
                    </p>
                    <template v-if="go.sent">
                        <p class="plan-sheet-note">Sent</p>
                    </template>
                    <template v-else-if="go.waits">
                        <p class="plan-sheet-note">Continuing when you're back online</p>
                    </template>
                    <template v-else-if="go.stale">
                        <p class="plan-sheet-note">The plan changed since you opened it</p>
                        <button type="button" class="plan-sheet-button" @click="go.again()">Look again</button>
                    </template>
                    <template v-else-if="go.held">
                        <p class="plan-sheet-note">Continuing in {{ go.left }}</p>
                        <button type="button" class="plan-sheet-button" @click="go.undo()">Undo</button>
                    </template>
                    <template v-else>
                        <button type="button" class="plan-sheet-button primary" @click="go.start()">Continue</button>
                    </template>
                    <template v-if="go.trouble">
                        <p class="plan-sheet-note" role="alert">{{ go.trouble }}</p>
                    </template>
                </section>
            </template>
            <ol class="plan-sheet-phases">
                <template v-for="(phase, index) in plan.phases" :key="index">
                    <li :class="['plan-sheet-phase', kind(index + 1)]">
                        <button type="button" class="plan-sheet-phase-head" :aria-expanded="opened.has(index + 1)" @click="toggle(index + 1)">
                            <span class="plan-sheet-phase-name">
                                <strong>{{ phase.title }}</strong>
                                <small>{{ tag(index + 1) }} · Phase {{ index + 1 }}</small>
                            </span>
                            <span class="plan-sheet-phase-count">{{ phase.todos.length ? `${closed(phase)} of ${phase.todos.length}` : "No to-dos yet" }}</span>
                            <PhoneChevron :size="12" :facing="opened.has(index + 1) ? 'down' : 'right'" />
                        </button>
                        <template v-if="opened.has(index + 1)">
                            <ul class="plan-sheet-todos" :aria-label="counted(phase)">
                                <template v-for="todo in phase.todos" :key="todo.n">
                                    <li :class="{done: todo.done}">{{ todo.title }}</li>
                                </template>
                            </ul>
                        </template>
                    </li>
                    <template v-if="checkpointAfter(index + 1)">
                        <li class="plan-sheet-checkpoint">Checkpoint: you choose when phase {{ at + 1 }} starts</li>
                    </template>
                </template>
            </ol>
            <button type="button" class="plan-sheet-close" @click="emit('close')">Close</button>
        </div>
    </PhoneSheet>
</template>

<style scoped>
.plan-sheet {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 4px 0 24px;
}

.plan-sheet-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.plan-sheet-kind {
    color: var(--text-3);
    font-size: 0.765rem;
}

.plan-sheet-full {
    display: flex;
    align-items: center;
    gap: 2px;
    min-height: 44px;
    padding: 0 6px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
}

h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
}

.plan-sheet-abstract {
    margin: 0;
    color: var(--text-3);
    font-size: 0.765rem;
    text-align: center;
}

.plan-sheet-wait {
    padding: 14px 16px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--tone-warn) 12%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--tone-warn) 50%, transparent);
}

.plan-sheet-wait h3 {
    margin: 0 0 4px;
    color: var(--tone-warn);
    font-size: 0.765rem;
}

.plan-sheet-wait p {
    margin: 0 0 12px;
    color: var(--text-2);
    font-size: 0.824rem;
}

.plan-sheet-wait .plan-sheet-note {
    font-weight: 600;
}

.plan-sheet-button {
    width: 100%;
    min-height: 46px;
    border: 0;
    border-radius: 12px;
    background: var(--sel);
    color: var(--text);
    font: inherit;
    font-weight: 600;
}

.plan-sheet-button.primary {
    background: var(--accent);
    color: #fff;
}

.plan-sheet-phases {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.plan-sheet-phase {
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
}

.plan-sheet-phase.now {
    box-shadow: inset 3px 0 0 var(--accent);
}

.plan-sheet-phase.waits {
    box-shadow: inset 3px 0 0 var(--tone-warn);
}

.plan-sheet-phase-head {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 48px;
    padding: 8px 14px 8px 16px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
}

.plan-sheet-phase-name {
    flex: 1;
    min-width: 0;
}

.plan-sheet-phase-name strong,
.plan-sheet-phase-name small {
    display: block;
}

.plan-sheet-phase-name small {
    color: var(--text-3);
    font-size: 0.706rem;
}

.plan-sheet-phase-count {
    flex: none;
    color: var(--text-3);
    font-size: 0.765rem;
    font-variant-numeric: tabular-nums;
}

.plan-sheet-todos {
    margin: 0;
    padding: 0 16px 12px;
    list-style: none;
}

.plan-sheet-todos li {
    padding: 5px 0;
    color: var(--text-2);
    font-size: 0.824rem;
}

.plan-sheet-todos li.done {
    color: var(--text-4);
    text-decoration: line-through;
}

.plan-sheet-checkpoint {
    padding: 10px 14px;
    border: 1px dashed var(--tone-warn);
    border-radius: 12px;
    color: var(--tone-warn);
    font-size: 0.765rem;
}

.plan-sheet-close {
    min-height: 46px;
    border: 0;
    border-radius: 12px;
    background: var(--sel);
    color: var(--text);
    font: inherit;
    font-weight: 600;
}
</style>
