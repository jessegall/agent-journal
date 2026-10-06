<script setup>
import {ref} from "vue";
import TextDisplay from "../../kit/TextDisplay.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import PhoneSettingRow from "./PhoneSettingRow.vue";
import {save, saveTiming} from "./catalog.js";

defineProps({group: {type: Object, required: true}, head: {type: String, default: ""}});
const emit = defineEmits(["act"]);
const reading = ref(false);
const rowsOf = (item) => (item.block ? [item.head, ...item.rows] : [item]);
</script>

<template>
    <CellGroup :head="head" :line="head ? group.line : ''">
        <template v-if="group.head">
            <PhoneSettingRow :row="group.head" @change="save(group.head, $event)" @timing="saveTiming(group.head, $event)" />
        </template>
        <template v-for="item in group.items" :key="item.key">
            <template v-for="row in rowsOf(item)" :key="row.key">
                <PhoneSettingRow :row="row" @change="save(row, $event)" @timing="saveTiming(row, $event)" @act="emit('act', $event)" />
            </template>
        </template>
        <template v-for="one in group.always" :key="one.key">
            <Cell :label="one.label" still>
                <template #end><span class="always">Always on</span></template>
            </Cell>
        </template>
        <template v-for="row in group.danger" :key="row.key">
            <PhoneSettingRow :row="row" @act="emit('act', $event)" />
        </template>
        <template v-if="group.explains">
            <Cell :label="reading ? 'Hide how it works' : 'How it works'" tone="accent" :chevron="false" @pick="reading = !reading" />
        </template>
    </CellGroup>
    <template v-if="reading">
        <TextDisplay class="explained" :text="group.explains" />
    </template>
</template>

<style scoped>
.always {
    color: var(--text-3);
    font-size: 0.875rem;
}

.explained {
    margin: 10px 4px 0;
    color: var(--text-2);
    font-size: 0.9375rem;
}
</style>
