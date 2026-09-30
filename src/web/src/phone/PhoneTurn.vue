<script setup>
import PhoneQuestion from "./PhoneQuestion.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TextDisplay from "../kit/TextDisplay.vue";

defineProps({item: {type: Object, required: true}});
</script>

<template>
    <SwitchCase :value="item.type">
        <template #question>
            <PhoneQuestion :question="item" />
        </template>
        <template #default>
            <div :class="['turn', item.who]">
                <TextDisplay :text="item.brief || item.title" />
            </div>
        </template>
    </SwitchCase>
</template>

<style scoped>
.turn {
    max-width: 88%;
    padding: 10px 12px;
    border-radius: 12px;
    line-height: 1.5;
    overflow-wrap: anywhere;
}

.turn.user {
    align-self: flex-end;
    background: var(--accent-dim);
}

.turn.agent {
    align-self: flex-start;
    background: var(--raised);
}
</style>
