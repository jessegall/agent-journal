<script setup>
import {computed, ref} from "vue";
import TextDisplay from "../kit/TextDisplay.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {HELPER_WORDS, helperLine, stateAt} from "../domain/helpers.js";
import {age, clock, span} from "../format/time.js";
import {plainDoing} from "./doing.js";
import Icon from "../kit/Icon.vue";

const props = defineProps({row: {type: Object, required: true}, kind: {type: String, required: true}});
const emit = defineEmits(["open", "read"]);
const unfolded = ref(false);
const helper = computed(() => props.kind === "helper");
const name = computed(() => props.row.name || props.row.type || "Subagent");
const timing = computed(() => {
    const at = stateAt(props.row);
    const value = age(at);
    return value === "now" ? "just now" : value && `${value} ago`;
});
const workingFor = computed(() => span(Math.max(0, Date.now() / 1000 - (props.row.started || props.row.at || 0))));
const line = computed(() => {
    const row = props.row;
    if (row.state === "needs") return row.reason;
    if (row.state === "reported") return row.report ? `Reported: ${row.report}` : "Reported";
    if (row.state === "working" || row.state === "running")
        return plainDoing([row.tool, row.file?.split("/").pop()].filter(Boolean).join(" ") || row.now) || "Working";
    if (row.state === "idle") return "Idle";
    if (!helper.value && row.ended) return `Ran ${span(row.ended - row.at)}, ended ${clock(row.ended)}`;
    return HELPER_WORDS[row.state];
});
const toggle = () => (helper.value ? emit("open", props.row) : (unfolded.value = !unfolded.value));
</script>

<template>
    <article :class="['at-work-row', row.state]">
        <button type="button" class="at-work-row-main" :aria-expanded="helper ? undefined : unfolded" @click="toggle">
            <span :class="['at-work-dot', row.state]" aria-hidden="true" />
            <span class="at-work-copy">
                <span class="at-work-title">
                    <strong>{{ name }}</strong>
                    {{ row.title || row.task }}
                </span>
                <span class="at-work-now">{{ line }}</span>
                <span class="at-work-model">{{ helper ? helperLine(row) : [row.type, row.model].filter(Boolean).join(" · ") }}</span>
            </span>
            <span class="at-work-state">
                <strong>{{ HELPER_WORDS[row.state] }}</strong>
                <span>{{ row.state === "working" || row.state === "running" ? workingFor : timing }}</span>
            </span>
            <Icon name="chevronRight" bold :facing="helper ? 'right' : unfolded ? 'up' : 'down'" :size="13" />
        </button>
        <template v-if="!helper && unfolded">
            <div class="at-work-unfolded">
                <span>Task</span>
                <TextDisplay :text="row.task" />
                <SwitchCase :value="row.state">
                    <template #working>
                        <span>Outcome</span>
                        <p>Still working. Its answer shows here when it finishes.</p>
                    </template>
                    <template #running>
                        <span>Outcome</span>
                        <p>Still working. Its answer shows here when it finishes.</p>
                    </template>
                    <template #refused>
                        <span>Outcome</span>
                        <TextDisplay :text="`Refused: ${row.refusal}`" />
                    </template>
                    <template #stopped>
                        <span>Stopped at {{ clock(row.ended) }}</span>
                    </template>
                    <template #default>
                        <span>Outcome, {{ clock(row.ended) }}</span>
                        <TextDisplay :text="row.outcome" />
                        <template v-if="row.report">
                            <button type="button" class="at-work-report" @click="emit('read', `report:${row.report}`)">
                                Read the report
                            </button>
                        </template>
                    </template>
                </SwitchCase>
            </div>
        </template>
    </article>
</template>

<style scoped>
.at-work-row + .at-work-row {
    border-top: 1px solid var(--line);
}

.at-work-row-main {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 72px;
    padding: 8px 12px;
    border: 0;
    background: transparent;
    color: var(--text);
    font: inherit;
    text-align: left;
}

.at-work-dot {
    flex: none;
    width: 8px;
    height: 8px;
    border: 1.5px solid var(--text-4);
    border-radius: 50%;
}

.at-work-dot.working,
.at-work-dot.running {
    border-color: var(--accent);
    background: var(--accent);
    animation: at-work-pulse 1.6s ease-in-out infinite;
}

.at-work-dot.needs {
    border-color: var(--tone-warn);
    background: var(--tone-warn);
}

.at-work-dot.reported {
    border-color: var(--tone-good);
    background: var(--tone-good);
}

.at-work-dot.ended,
.at-work-dot.refused {
    border-color: var(--danger);
    background: var(--danger);
}

.at-work-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.at-work-title,
.at-work-now,
.at-work-model {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.at-work-title {
    font-size: 0.882rem;
}

.at-work-now {
    color: var(--text-2);
    font-size: 0.824rem;
}

.at-work-model {
    color: var(--text-3);
    font-size: 0.765rem;
}

.at-work-state {
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: flex-end;
    color: var(--text-2);
    font-size: 0.765rem;
}

.at-work-state strong {
    font-weight: 400;
}

.reported .at-work-state strong {
    color: var(--tone-good);
    font-weight: 600;
}

.needs .at-work-state strong,
.needs .at-work-now {
    color: var(--tone-warn);
    font-weight: 600;
}

.working .at-work-state strong,
.running .at-work-state strong {
    color: var(--accent-text);
}

.ended .at-work-state strong,
.refused .at-work-state strong {
    color: var(--danger);
}

.at-work-unfolded {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 34px 14px;
    color: var(--text-2);
    font-size: 0.824rem;
}

.at-work-unfolded > span {
    color: var(--text-3);
    font-size: 0.765rem;
}

.at-work-unfolded :deep(p) {
    margin: 0;
}

.at-work-report {
    align-self: flex-start;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--accent-text);
    font: inherit;
}

@keyframes at-work-pulse {
    50% {
        opacity: 0.35;
    }
}

@media (prefers-reduced-motion: reduce) {
    .at-work-dot.working,
    .at-work-dot.running {
        animation: none;
    }
}
</style>
