<script setup>
import {computed} from "vue";
import PhoneQuestion from "./PhoneQuestion.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Icon from "../kit/Icon.vue";
import ReadTicks from "../kit/ReadTicks.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {clock} from "../format/time.js";

const props = defineProps({item: {type: Object, required: true}});
const files = computed(() => Object.keys(props.item.files || {}));
</script>

<template>
    <SwitchCase :value="item.type">
        <template #question>
            <PhoneQuestion :question="item" />
        </template>
        <template #default>
            <div :class="['turn', item.who]">
                <TextDisplay :text="item.brief || item.title" />
                <template v-if="files.length">
                    <span class="turn-files">
                        <Icon name="paperclip" :size="12" />
                        {{ files.join(", ") }}
                    </span>
                </template>
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

.turn-files {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 6px;
    color: var(--text-2);
    font-size: 13px;
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

.turn.agent .turn-files {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 6px;
    color: var(--text-2);
    font-size: 13px;
}

.turn-meta {
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
