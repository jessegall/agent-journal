<script setup lang="ts" generic="Row">
/**
 * A table of rows under its headings, or a single line when there are none. Each row's cells come from the row slot.
 */
defineProps<{ headings: string[]; rows: Row[]; rowKey: (row: Row) => string | number; empty: string }>();

defineSlots<{ row(props: { row: Row }): unknown }>();
</script>

<template>
    <p v-if="rows.length === 0">{{ empty }}</p>
    <table v-else>
        <thead>
            <tr>
                <th v-for="heading in headings" :key="heading">{{ heading }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in rows" :key="rowKey(row)">
                <slot name="row" :row="row" />
            </tr>
        </tbody>
    </table>
</template>
