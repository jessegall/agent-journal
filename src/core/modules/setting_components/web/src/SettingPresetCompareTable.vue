<script setup>
// the presets side by side: a row for each switch, a column for each preset and one for the form as it is now. A
// row where the presets differ is marked, because that is the switch that makes them different.
const props = defineProps({rows: {type: Array, required: true}, presets: {type: Array, required: true}, now: {type: Object, required: true}});

const word = (value) => (value ? "On" : "Off");
const differs = (row) => new Set(props.presets.map((preset) => preset.values[row.key])).size > 1;
</script>

<template>
    <table class="setting-preset-table">
        <thead>
            <tr>
                <th>Switch</th>
                <template v-for="preset in presets" :key="preset.key">
                    <th>{{ preset.name }}</th>
                </template>
                <th>Now</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="row in rows" :key="row.key">
                <tr :class="{differs: differs(row)}" :data-compare-row="row.key" :data-differs="differs(row)">
                    <td class="title">{{ row.title }}</td>
                    <template v-for="preset in presets" :key="preset.key">
                        <td>{{ word(preset.values[row.key]) }}</td>
                    </template>
                    <td class="now">{{ word(now[row.key]) }}</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<style scoped>
.setting-preset-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
th { padding: 8px 12px; border-bottom: 1px solid var(--border); color: var(--text-3); font-size: 11.5px; font-weight: 400; text-align: left; }
td { padding: 9px 12px; border-bottom: 1px solid var(--border); color: var(--text-2); }
td.title { color: var(--text); }
td.now { color: var(--text); }
tr.differs td { background: var(--accent-dim); }
</style>
