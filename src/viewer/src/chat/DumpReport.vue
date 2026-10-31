<script setup>
import Btn from "../kit/Btn.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TextDisplay from "../kit/TextDisplay.vue";

defineProps({
    title: {type: String, required: true},
    lines: {type: Array, default: () => []},
    summary: {type: String, default: ""},
    suggestions: {type: Array, default: () => []},
    summing: Boolean,
});
const emit = defineEmits(["take", "leave"]);
</script>

<template>
    <section class="dump-report">
        <p class="dump-report-title">{{ title }}</p>
        <template v-for="line in lines" :key="line">
            <p class="dump-report-line">{{ line }}</p>
        </template>
        <template v-if="summary">
            <TextDisplay class="dump-report-summary" :text="summary" />
        </template>
        <template v-if="summing">
            <p class="dump-report-note">Writing a summary of what was filed…</p>
        </template>
        <template v-else>
            <p class="dump-report-note">Nothing was planned or started. Ask about any of it in the files on the left.</p>
        </template>
        <template v-if="suggestions.length">
            <p class="dump-report-next">What the agent can do next</p>
            <div class="dump-report-offers">
                <template v-for="s in suggestions" :key="s.pick">
                    <div class="dump-report-sugg">
                        <span class="dump-report-ask">{{ s.ask || s.label }}</span>
                        <SwitchCase :value="s.state">
                            <template #taken>
                                <span class="dump-report-answered">Sent to the agent</span>
                            </template>
                            <template #left>
                                <span class="dump-report-answered">Not now</span>
                            </template>
                            <template #default>
                                <span class="dump-report-btns">
                                    <Btn small :busy="s.busy" @click="emit('take', s.pick)">{{ s.ask ? s.label : "Yes, do it" }}</Btn>
                                    <Btn small @click="emit('leave', s.pick)">Not now</Btn>
                                </span>
                            </template>
                        </SwitchCase>
                    </div>
                </template>
            </div>
        </template>
    </section>
</template>

<style scoped>
.dump-report {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 8px;
    padding: 16px 16px 14px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    animation: dump-report-arrive 0.6s var(--ease) both;
}

.dump-report-title {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    color: var(--text);
    text-wrap: pretty;
}

.dump-report-line {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin: 0;
    font-size: 13px;
    color: var(--text-2);
}

.dump-report-summary {
    font-size: 13px;
    color: var(--text-2);
}

.dump-report-note {
    margin: 0 0 2px;
    font-size: 12.5px;
    color: var(--text-3);
}

.dump-report-next {
    margin: 6px 0 0;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-3);
}

.dump-report-offers {
    display: flex;
    flex-direction: column;
}

.dump-report-sugg {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 0;
    border-top: 1px solid var(--border);
    font-size: 13px;
    color: var(--text-2);
}

.dump-report-ask {
    flex: 1;
    min-width: 0;
    text-wrap: pretty;
}

.dump-report-btns {
    display: flex;
    flex: none;
    gap: 6px;
}

.dump-report-answered {
    flex: none;
    color: var(--text-4);
}

@keyframes dump-report-arrive {
    from {
        opacity: 0;
        translate: 0 8px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dump-report {
        animation: none;
    }
}
</style>
