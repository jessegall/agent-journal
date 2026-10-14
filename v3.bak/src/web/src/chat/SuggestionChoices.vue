<script setup>
import Btn from "../kit/Btn.vue";

defineProps({choices: {type: Array, required: true}, busy: {type: String, default: ""}, phone: Boolean});
const emit = defineEmits(["press"]);
</script>

<template>
    <div :class="['sg-choices', {phone}]">
        <template v-for="choice in choices" :key="choice.act">
            <div :class="['choice', choice.act]">
                <Btn
                    :kind="choice.primary ? 'primary' : 'ghost'"
                    :busy="busy === choice.act"
                    :disabled="Boolean(busy)"
                    @click="emit('press', choice)"
                >
                    {{ choice.label }}
                    <template v-if="phone">
                        <span class="sub">{{ choice.caption }}</span>
                    </template>
                </Btn>
                <template v-if="!phone">
                    <span class="choice-cap">{{ choice.caption }}</span>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.sg-choices {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 10px;
    margin-top: 12px;
}

.choice {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 190px;
}

.choice-cap {
    color: var(--text-4);
    font-size: 11px;
    line-height: 1.35;
    text-wrap: pretty;
}

.sg-choices.phone {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
    gap: 8px;
}

.phone .choice {
    max-width: none;
}

.phone .choice.change {
    grid-column: 1 / -1;
    order: -1;
}

.phone .choice.yes {
    order: 1;
}

.phone .choice :deep(.btn) {
    width: 100%;
    min-height: 52px;
    height: auto;
    padding: 6px 10px;
    border-radius: 12px;
    white-space: normal;
}

.phone .choice :deep(.btn-label) {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.phone .choice.change :deep(.btn) {
    min-height: 44px;
}

.sub {
    display: block;
    color: var(--text-3);
    font-size: 0.75em;
}
</style>
