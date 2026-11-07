<script setup>
import {computed, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import InspectorActions from "../kit/InspectorActions.vue";
import {movesOf} from "../domain/resourceNouns.js";

// the available actions for a row; an action that needs words asks for them first
const props = defineProps({noun: {type: String, required: true}, id: {type: Number, required: true}, row: {type: Object, default: null}, read: {type: Function, required: true}, inline: Boolean});
const emit = defineEmits(["done"]);
const moves = computed(() => movesOf(props.noun, props.row));
const refusal = ref("");
const asking = ref(null);
const words = ref("");
const target = ref("");

watch(() => props.id, () => {
    refusal.value = "";
    asking.value = null;
});

async function run(move, said = "") {
    const answer = await props.read([move.noun ?? props.noun, move.word, String(props.id), ...(move.flag ? [move.flag, said] : move.positional ? [said] : []), ...(move.opener && target.value.trim() ? ["--on", target.value.trim()] : [])]);
    refusal.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    asking.value = null;
    words.value = "";
    target.value = "";
    emit("done");
}

const press = (move) => (move.confirm ? (asking.value = move) : move.said ? run(move, move.said) : move.flag || move.positional ? ((asking.value = move), (words.value = "")) : run(move));
const send = () => words.value.trim() && run(asking.value, words.value.trim());
defineExpose({moves, press});
</script>

<template>
    <template v-if="moves.length">
        <InspectorActions :inline="inline">
            <template v-if="refusal">
                <p class="refusal" role="alert" data-resource-refusal>{{ refusal }}</p>
            </template>
            <template v-if="asking?.confirm">
                <div class="ask" data-resource-confirm>
                    <span class="ask-text">{{ asking.confirm }}</span>
                    <Btn small :variant="asking.danger ? 'ghost' : 'primary'" :bordered="asking.danger" :class="{danger: asking.danger}" data-resource-confirm-yes @click="run(asking)">{{ asking.label }}</Btn>
                    <Btn small variant="ghost" @click="asking = null">Back</Btn>
                </div>
            </template>
            <template v-else-if="asking">
                <form class="ask" data-resource-ask @submit.prevent="send">
                    <input v-model="words" class="ask-input" :placeholder="asking.ask" :aria-label="asking.ask" @keydown.esc.stop="asking = null" />
                    <template v-if="asking.opener">
                        <input v-model="target" class="ask-input" data-resource-opener :placeholder="asking.opener" :aria-label="asking.opener" @keydown.esc.stop="asking = null" />
                    </template>
                    <Btn small variant="primary" type="submit" :disabled="!words.trim()">{{ asking.label }}</Btn>
                    <Btn small variant="ghost" @click="asking = null">Back</Btn>
                </form>
            </template>
            <template v-else>
                <div class="moves">
                    <template v-for="move in moves" :key="move.word">
                        <Btn :small="!move.bordered" :bordered="move.bordered" :icon="move.icon" :variant="move.main ? 'primary' : 'ghost'" :class="{danger: move.danger}" :data-move="move.word" @click="press(move)">{{ move.label }}</Btn>
                    </template>
                </div>
            </template>
        </InspectorActions>
    </template>
</template>

<style scoped>
.moves,
.ask {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
}

.ask-text {
    flex: 1;
    color: var(--text-2);
    font-size: 12.5px;
}

.ask-input {
    flex: 1;
    min-width: 0;
    padding: 5px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
}

.danger {
    border-color: color-mix(in oklab, var(--danger) 55%, var(--border-2));
    color: var(--danger);
}

.refusal {
    margin: 0 0 8px;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
