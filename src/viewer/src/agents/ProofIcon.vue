<script setup>
import {computed} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {PROOF_WORDS} from "../domain/workerTurn.js";

const props = defineProps({state: {type: String, required: true}});
const SHAPES = {checked: "checked", "checked, not done": "checked", shown: "proved", "not done": "proved", short: "short"};
const shape = computed(() => SHAPES[props.state] || "unproved");
</script>

<template>
    <svg :class="['proof-icon', state.replace(/[ ,]+/g, '-')]" width="14" height="14" viewBox="0 0 16 16" role="img" :aria-label="PROOF_WORDS[state]">
        <SwitchCase :value="shape">
            <template #checked>
                <circle cx="8" cy="8" r="6.3" class="fill" />
                <polyline points="5.3,8.2 7.2,10 10.7,6.2" class="tick" />
            </template>
            <template #proved>
                <circle cx="8" cy="8" r="5.6" class="stroke" />
                <circle cx="8" cy="8" r="2.4" class="fill" />
            </template>
            <template #short>
                <circle cx="8" cy="8" r="5.6" class="stroke" />
                <path d="M9.6 5.6 L6.8 8 L9.6 10.4" class="stroke" />
            </template>
            <template #default>
                <circle cx="8" cy="8" r="5.6" class="stroke dashed" />
            </template>
        </SwitchCase>
    </svg>
</template>

<style scoped>
.proof-icon {
    --tone: var(--text-4);
    display: block;
    flex: none;
    margin-top: 2px;
}

.proof-icon.checked,
.proof-icon.checked-not-done {
    --tone: var(--tone-good);
}

.proof-icon.shown,
.proof-icon.not-done {
    --tone: var(--progress);
}

.proof-icon.short,
.proof-icon.stale {
    --tone: var(--tone-warn);
}

.stroke {
    fill: none;
    stroke: var(--tone);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.stroke.dashed {
    stroke-dasharray: 2.2 1.9;
}

.fill {
    fill: var(--tone);
}

.tick {
    fill: none;
    stroke: var(--raised);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}
</style>
