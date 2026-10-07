<script setup>
import Btn from "../kit/Btn.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import Cell from "./kit/Cell.vue";
import CellGroup from "./kit/CellGroup.vue";

const ANSWERED = {taken: "Done", left: "Not now"};

defineProps({
    title: {type: String, required: true},
    lines: {type: Array, default: () => []},
    summary: {type: String, default: ""},
    summing: Boolean,
    suggestions: {type: Array, default: () => []},
});
const emit = defineEmits(["take", "leave"]);
</script>

<template>
    <CellGroup :head="title">
        <template v-for="line in lines" :key="line">
            <Cell :label="line" icon="check" still />
        </template>
        <template v-if="summing">
            <Cell label="Writing a summary of what was filed…" icon="clock" still />
        </template>
    </CellGroup>
    <template v-if="summary">
        <TextDisplay class="dump-summary" :text="summary" />
    </template>
    <template v-if="suggestions.length">
        <CellGroup head="Offers">
            <template v-for="offer in suggestions" :key="offer.pick">
                <Cell :label="offer.ask || offer.label" :sub="ANSWERED[offer.state] || ''" still>
                    <template v-if="!offer.state" #end>
                        <span class="dump-offer">
                            <Btn kind="primary" :busy="offer.busy" @click="emit('take', offer.pick)">
                                {{ offer.ask ? offer.label : "Yes, do it" }}
                            </Btn>
                            <Btn @click="emit('leave', offer.pick)">Not now</Btn>
                        </span>
                    </template>
                </Cell>
            </template>
        </CellGroup>
    </template>
</template>

<style scoped>
.dump-summary {
    margin: 0 4px 16px;
}

.dump-offer {
    display: flex;
    flex: none;
    gap: 6px;
}

.dump-offer :deep(.btn) {
    min-height: 44px;
}
</style>
