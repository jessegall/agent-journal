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
const faces = computed(() => [...new Set((props.item.reactions || []).map((r) => r.face))]);
const emit = defineEmits(["hold"]);
const HOLD_FOR = 450;
let timer = 0;
const press = () => (timer = setTimeout(() => emit("hold", props.item), HOLD_FOR));
const release = () => clearTimeout(timer);
</script>

<template>
    <SwitchCase :value="item.type">
        <template #question>
            <PhoneQuestion :question="item" />
        </template>
        <template #default>
            <div
                :class="['turn', item.who]"
                @touchstart.passive="press"
                @touchend="release"
                @touchmove.passive="release"
                @contextmenu.prevent="emit('hold', item)"
            >
                <TextDisplay :text="item.brief || item.title" />
                <template v-if="files.length">
                    <span class="turn-files">
                        <Icon name="paperclip" :size="12" />
                        {{ files.join(", ") }}
                    </span>
                </template>
                <template v-if="faces.length">
                    <span class="turn-faces">{{ faces.join(" ") }}</span>
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
    -webkit-touch-callout: none;
    user-select: none;
    padding: 10px 12px;
    border-radius: 12px;
    line-height: 1.5;
    overflow-wrap: anywhere;
}

.turn-faces {
    display: inline-block;
    margin-top: 6px;
    padding: 1px 7px;
    border-radius: 10px;
    background: var(--bg);
    font-size: 14px;
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

.turn.agent .turn-faces {
    display: inline-block;
    margin-top: 6px;
    padding: 1px 7px;
    border-radius: 10px;
    background: var(--bg);
    font-size: 14px;
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
