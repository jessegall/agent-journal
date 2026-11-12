<script setup>
import SettingUsageBar from "./SettingUsageBar.vue";

// the helper types in one table: what each does, how many run and are kept against their limits, and its context
// cap with where that comes from. A row opens its type; there is no edit button. The table sits flush against
// the tabs and the sides of its window, so each row keeps its own padding for text.
defineProps({rows: {type: Array, required: true}});
const emit = defineEmits(["open"]);
</script>

<template>
    <div class="setting-type-table" role="table">
        <div class="cols" role="row">
            <span>Helper type</span><span>What it does</span><span>Running</span><span>Kept</span><span>Context cap</span><span />
        </div>
        <template v-for="row in rows" :key="row.key">
            <button type="button" class="row" role="row" :data-type-row="row.key" @click="emit('open', row.key)">
                <span class="name">{{ row.name }}</span>
                <span class="line">{{ row.line }}</span>
                <SettingUsageBar :count="row.running" :limit="row.runLimit" />
                <SettingUsageBar :count="row.kept" :limit="row.keptLimit" />
                <span class="cap">
                    <span :class="{own: row.cap.own}">{{ row.cap.text }}</span>
                    <small>{{ row.cap.where }}</small>
                </span>
                <span class="chev" aria-hidden="true">›</span>
            </button>
        </template>
    </div>
</template>

<style scoped>
.setting-type-table { overflow: hidden; }
.cols, .row { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 2.2fr) 130px 130px 150px 16px; gap: 16px; align-items: center; padding: 0 22px; }
.cols { height: 34px; border-bottom: 1px solid var(--border); background: var(--raised); color: var(--text-3); font-size: 11.5px; }
.row { width: 100%; padding-top: 11px; padding-bottom: 11px; border: 0; border-bottom: 1px solid var(--border); background: none; color: var(--text); font: inherit; text-align: left; cursor: pointer; }
.row:hover { background: var(--hover); }
.name { font-size: 12.8px; font-weight: 500; }
.line { color: var(--text-3); font-size: 12px; line-height: 1.4; }
.cap { font-size: 12px; }
.cap small { display: block; margin-top: 2px; color: var(--text-3); font-size: 11px; }
.own { color: var(--accent-text); }
.chev { color: var(--text-3); font-size: 14px; }
</style>
