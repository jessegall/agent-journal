<script setup>
import {ref} from "vue";
import PhoneSheet from "../PhoneSheet.vue";
import Icon from "../../kit/Icon.vue";
import Cell from "./Cell.vue";

defineProps({
    title: {type: String, required: true},
    about: {type: String, required: true},
    actions: {type: Array, required: true},
    line: {type: String, default: "everything you can do with it"},
});
const emit = defineEmits(["close"]);
const sheet = ref(null);
let chosen = null;

function pick(action) {
    chosen = action;
    sheet.value.close();
}

function closed() {
    emit("close");
    chosen?.run();
}
</script>

<template>
    <PhoneSheet ref="sheet" :label="title" @close="closed">
        <template #head>
            <h2 class="actions-title">{{ title }}</h2>
            <p class="actions-sub">{{ about }} · {{ line }}</p>
        </template>
        <div class="actions-group">
            <template v-for="action in actions" :key="action.key">
                <Cell
                    :label="action.label"
                    :sub="action.sub || ''"
                    :tone="action.danger ? 'danger' : ''"
                    :chevron="false"
                    @pick="pick(action)"
                >
                    <template v-if="action.check" #end>
                        <Icon name="check" :size="16" class="actions-check" />
                    </template>
                </Cell>
            </template>
        </div>
    </PhoneSheet>
</template>

<style scoped>
.actions-title {
    margin: 0;
    font-size: 1.0625rem;
}

.actions-sub {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.actions-check {
    flex: none;
    color: var(--accent);
}

.actions-group {
    overflow: hidden;
    margin: 4px 0 8px;
    border-radius: 12px;
    background: var(--bg);
}
</style>
