<script setup>
import Icon from "../../kit/Icon.vue";
import {colorScheme, saveColorScheme, SCHEMES} from "../../composables/colorScheme.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import {toast} from "../kit/toast.js";

async function pick(key) {
    try {
        await saveColorScheme(key);
    } catch (error) {
        toast(error.message);
    }
}
</script>

<template>
    <CellGroup>
        <template v-for="scheme in SCHEMES" :key="scheme.key">
            <Cell :label="scheme.label" :chevron="false" @pick="pick(scheme.key)">
                <template #end>
                    <template v-if="scheme.key === colorScheme()">
                        <Icon name="check" :size="16" class="check" />
                    </template>
                </template>
            </Cell>
        </template>
    </CellGroup>
</template>

<style scoped>
.check {
    color: var(--accent-text);
}
</style>
