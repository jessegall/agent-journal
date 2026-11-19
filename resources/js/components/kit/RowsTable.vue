<script setup lang="ts" generic="Row">
/**
 * A table of rows under its headings, or a single line when there are none. Each row's cells come from the row slot.
 */
defineProps<{
    headings: string[];
    rows: Row[];
    rowKey: (row: Row) => string | number;
    empty: string;
}>();

defineSlots<{ row(props: { row: Row }): unknown }>();
</script>

<template>
    <template v-if="rows.length === 0">
        <p>{{ empty }}</p>
    </template>
    <template v-else>
        <table>
            <thead>
                <tr>
                    <template v-for="heading in headings" :key="heading">
                        <th>{{ heading }}</th>
                    </template>
                </tr>
            </thead>
            <tbody>
                <template v-for="row in rows" :key="rowKey(row)">
                    <tr>
                        <slot name="row" :row="row" />
                    </tr>
                </template>
            </tbody>
        </table>
    </template>
</template>
