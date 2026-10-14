<script setup>
import {computed} from "vue";
import ProgressBar from "./ProgressBar.vue";

const props = defineProps({items: {type: Array, required: true}, unit: {type: String, default: ""}});
const emit = defineEmits(["open"]);
const most = computed(() => Math.max(1, ...props.items.map((item) => Number(item.value) || 0)));
const unitText = computed(() => (/^[a-z]/i.test(props.unit) ? ` ${props.unit}` : props.unit));
</script>

<template>
    <div class="bars">
        <template v-for="(item, at) in items" :key="`${at}-${item.label}`">
            <component
                :is="item.open ? 'button' : 'div'"
                :type="item.open ? 'button' : undefined"
                :class="['bar-row', item.tone, {opens: item.open}]"
                @click="item.open && emit('open', item.open)"
            >
                <span class="bar-name">{{ item.label }}</span>
                <ProgressBar :value="Number(item.value) || 0" :max="most" :tone="item.tone" :least="2" />
                <span class="bar-value">{{ item.value }}{{ unitText }}</span>
            </component>
        </template>
    </div>
</template>

<style scoped>
.bars {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.bar-row {
    display: grid;
    grid-template-columns: minmax(120px, 34%) 1fr auto;
    align-items: center;
    gap: 12px;
    padding: 5px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
}

.bar-row.opens {
    cursor: pointer;
}

.bar-row.opens:hover {
    background: var(--hover);
}

.bar-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.bar-value {
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}
</style>
