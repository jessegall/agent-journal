<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
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
            <p class="dump-report-line">
                <Icon name="check" :size="11" />
                {{ line }}
            </p>
        </template>
        <template v-if="summary">
            <TextDisplay class="dump-report-summary" :text="summary" />
        </template>
        <template v-if="summing">
            <p class="dump-report-note">Writing a summary of what was filed…</p>
        </template>
        <template v-else>
            <p class="dump-report-note">Nothing was planned or started. Ask about any of it on the left.</p>
        </template>
        <template v-for="s in suggestions" :key="s.pick">
            <div :class="['dump-report-sugg', s.state]">
                <span class="dump-report-ask">{{ s.ask || s.label }}</span>
                <SwitchCase :value="s.state">
                    <template #taken>
                        <span class="dump-report-done">
                            <Icon name="check" :size="11" />
                            {{ s.label }}
                        </span>
                    </template>
                    <template #left>
                        <span class="dump-report-left">Not now</span>
                    </template>
                    <template #default>
                        <span class="dump-report-btns">
                            <Btn kind="primary" small :busy="s.busy" @click="emit('take', s.pick)">{{ s.ask ? s.label : "Do it" }}</Btn>
                            <Btn small @click="emit('leave', s.pick)">Not now</Btn>
                        </span>
                    </template>
                </SwitchCase>
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
    border: 1px solid color-mix(in srgb, var(--tone-good) 32%, transparent);
    border-radius: 12px;
    background: color-mix(in srgb, var(--tone-good) 5%, var(--bg));
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

.dump-report-line :deep(.ico) {
    color: var(--tone-good);
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

.dump-report-sugg {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border-2));
    border-radius: 10px;
    background: color-mix(in srgb, var(--accent) 7%, var(--bg));
    font-size: 13px;
    color: var(--text-2);
    animation: dump-report-arrive 0.5s var(--ease) both;
    transition:
        border-color 0.3s,
        background 0.3s,
        opacity 0.3s;
}

.dump-report-sugg.taken,
.dump-report-sugg.left {
    border-color: var(--border-2);
    background: transparent;
}

.dump-report-sugg.left {
    opacity: 0.55;
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

.dump-report-done {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    color: var(--tone-good);
}

.dump-report-left {
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
    .dump-report,
    .dump-report-sugg {
        animation: none;
    }
}
</style>
