<script setup>
import PhoneQuestion from "./PhoneQuestion.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import ReadTicks from "../kit/ReadTicks.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {clock} from "../format/time.js";

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
                <span class="turn-meta">
                    {{ clock(item.created) }}
                    <template v-if="item.who === 'user'">
                        <ReadTicks :message="item" />
                    </template>
                </span>
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

.turn-meta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
    color: var(--text-3);
    font-size: 11.5px;
}

.turn.agent .turn-meta {
    justify-content: flex-start;
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
