<script setup>
import {computed, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import {movesOf} from "../domain/resourceKinds.js";

// what a person can do to a row in its state, as buttons along the foot of its panel; a move that needs words asks for them first
const props = defineProps({kind: {type: String, required: true}, id: {type: Number, required: true}, row: {type: Object, default: null}, read: {type: Function, required: true}, inline: Boolean});
const emit = defineEmits(["done"]);
const moves = computed(() => movesOf(props.kind, props.row));
const refusal = ref("");
const asking = ref(null);
const words = ref("");

watch(() => props.id, () => {
    refusal.value = "";
    asking.value = null;
});

async function run(move, said = "") {
    const answer = await props.read([props.kind, move.word, String(props.id), ...(move.flag ? [move.flag, said] : [])]);
    refusal.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    asking.value = null;
    words.value = "";
    emit("done");
}

const press = (move) => (move.confirm ? (asking.value = move) : move.said ? run(move, move.said) : move.flag ? ((asking.value = move), (words.value = "")) : run(move));
const send = () => words.value.trim() && run(asking.value, words.value.trim());
defineExpose({moves, press});
</script>

<template>
    <template v-if="moves.length">
        <footer :class="['foot', {inline}]">
            <template v-if="refusal">
                <p class="refusal" role="alert" data-resource-refusal>{{ refusal }}</p>
            </template>
            <template v-if="asking?.confirm">
                <div class="ask" data-resource-confirm>
                    <span class="ask-text">{{ asking.confirm }}</span>
                    <Btn small kind="primary" data-resource-confirm-yes @click="run(asking)">{{ asking.label }}</Btn>
                    <Btn small kind="ghost" @click="asking = null">Back</Btn>
                </div>
            </template>
            <template v-else-if="asking">
                <form class="ask" data-resource-ask @submit.prevent="send">
                    <input v-model="words" class="ask-input" :placeholder="asking.ask" :aria-label="asking.ask" @keydown.esc.stop="asking = null" />
                    <Btn small kind="primary" type="submit" :disabled="!words.trim()">{{ asking.label }}</Btn>
                    <Btn small kind="ghost" @click="asking = null">Back</Btn>
                </form>
            </template>
            <template v-else>
                <div class="moves">
                    <template v-for="move in moves" :key="move.word">
                        <Btn small :kind="move.main ? 'primary' : 'ghost'" :data-move="move.word" @click="press(move)">{{ move.label }}</Btn>
                    </template>
                </div>
            </template>
        </footer>
    </template>
</template>

<style scoped>
.foot {
    flex: none;
    padding: 10px 16px;
    border-top: 1px solid var(--border);
    background: var(--raised);
}

.foot.inline {
    margin: 8px 0 16px;
    padding: 0;
    border: 0;
    background: none;
}

.moves,
.ask {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
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

.refusal {
    margin: 0 0 8px;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
