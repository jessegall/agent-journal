<script setup>
import Btn from "../kit/Btn.vue";
import DropList from "../kit/DropList.vue";
import EmptyState from "../kit/EmptyState.vue";
import SwitchCase from "../kit/SwitchCase.vue";

defineProps({
    state: {type: String, required: true},
    eventTitle: {type: String, required: true},
    newItems: {type: Array, required: true},
    parentWords: {type: String, required: true},
    steps: {type: Number, required: true},
    busy: {type: Boolean, default: false},
    unlocked: {type: Boolean, default: false},
});
const emit = defineEmits(["start", "turn-on", "add", "edit"]);
</script>

<template>
    <SwitchCase :value="state">
        <template #none>
            <EmptyState class="chart-empty" title="Nothing is set up here">
                No workflow answers {{ eventTitle.toLowerCase() }} yet.
                <br />
                <DropList
                    class="chart-empty-add"
                    label="New workflow"
                    icon="plus"
                    :items="newItems"
                    :menu-width="260"
                    @pick="emit('start', $event.key)"
                />
            </EmptyState>
        </template>
        <template #gone>
            <EmptyState class="chart-empty" title="This workflow is turned off">
                Its steps are gone, so the journal does nothing here. {{ parentWords }}
                <br />
                <Btn class="chart-empty-add" :busy="busy" @click.stop="emit('turn-on')">Turn on</Btn>
            </EmptyState>
        </template>
        <template #off>
            <EmptyState class="chart-empty" title="This workflow is turned off">
                Its {{ steps }} {{ steps === 1 ? "step is" : "steps are" }} kept. Turn on brings {{ steps === 1 ? "it" : "them" }} back.
                {{ parentWords }}
                <br />
                <Btn class="chart-empty-add" :busy="busy" @click.stop="emit('turn-on')">Turn on</Btn>
            </EmptyState>
        </template>
        <template #lonely>
            <div class="chart-hint">
                <p class="chart-hint-title">Nothing follows the trigger yet</p>
                <p class="chart-hint-text">Add step puts a check or an action below the selected step and connects it.</p>
                <template v-if="unlocked">
                    <Btn @click.stop="emit('add')">Add step</Btn>
                </template>
                <template v-else>
                    <Btn @click.stop="emit('edit')">Edit</Btn>
                </template>
            </div>
        </template>
    </SwitchCase>
</template>

<style scoped>
.chart-empty {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.chart-empty-add {
    margin-top: 10px;
}

.chart-hint {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 24px;
    text-align: center;
    pointer-events: none;
}

.chart-hint-title {
    margin: 0;
    color: var(--text-2);
    font-size: 14px;
    font-weight: 500;
}

.chart-hint-text {
    max-width: 300px;
    margin: 0 0 6px;
    color: var(--text-4);
    font-size: 12.5px;
    line-height: 1.5;
}
</style>
