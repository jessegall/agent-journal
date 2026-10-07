<script setup>
import {computed} from "vue";
import {saveViewerSetting, viewerSetting} from "../../composables/settings.js";
import {DEFAULT_HIDDEN, HIDDEN_KEY, toggled, visibilityChoices} from "../../domain/chatVisibility.js";
import Switch from "../../kit/Switch.vue";
import Button from "../kit/Button.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import {toast} from "../kit/toast.js";

const hidden = computed(() => viewerSetting(HIDDEN_KEY, DEFAULT_HIDDEN));
const groups = computed(() => visibilityChoices(hidden.value));

async function save(list) {
    try {
        await saveViewerSetting(HIDDEN_KEY, list);
    } catch (error) {
        toast(error.message);
    }
}
</script>

<template>
    <template v-for="group in groups" :key="group.title">
        <CellGroup :head="group.title">
            <template v-for="kind in group.kinds" :key="kind.key">
                <Cell :label="kind.label" :icon="kind.icon" still>
                    <template #end>
                        <Switch large :on="kind.on" :title="kind.label" @change="save(toggled(hidden, kind.key))" />
                    </template>
                </Cell>
            </template>
        </CellGroup>
    </template>
    <Button fill :disabled="!hidden.length" @click="save([])">Show everything</Button>
</template>
