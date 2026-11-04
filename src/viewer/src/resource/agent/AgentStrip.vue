<script setup>
// the figures of an agent in a row of cells; a cell with a meter shows how full it is
defineProps({cells: {type: Array, required: true}});
</script>

<template>
    <div class="strip" data-agent-strip>
        <template v-for="cell in cells" :key="cell.key">
            <div class="cell" :data-agent-cell="cell.key">
                <small>{{ cell.label }}</small>
                <b :class="{bad: cell.bad}">{{ cell.value }}</b>
                <template v-if="cell.meter !== undefined">
                    <div class="meter"><i :class="{high: cell.high}" :style="{width: `${cell.meter}%`}" /></div>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.strip { display: flex; flex-wrap: wrap; border-bottom: 1px solid var(--border-inner); }
.cell { flex: 1 1 100px; min-width: 100px; padding: 10px 14px; border-right: 1px solid var(--border-inner); }
.cell:last-child { border-right: 0; }
small { display: block; color: var(--text-3); font-size: 11.5px; }
b { display: block; margin-top: 2px; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; }
b.bad { color: var(--danger); }
.meter { height: 3px; margin-top: 6px; border-radius: 2px; background: var(--chip); }
.meter i { display: block; height: 100%; border-radius: 2px; background: var(--accent); }
.meter i.high { background: var(--warn, var(--tone-warn)); }
</style>
