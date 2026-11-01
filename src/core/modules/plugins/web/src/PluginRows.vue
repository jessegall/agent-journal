<script setup>
import {Skeleton, useRows, useWindow} from "@journal/window-kit";

const context = useWindow();
const {rows, failure, loaded} = useRows("plugin list", ["plugin.*"]);

const switchOver = (row) => context.run(`plugin ${row.enabled ? "disable" : "enable"} ${row.name}`);
</script>

<template>
    <div class="plugins">
        <template v-if="!loaded">
            <Skeleton shape="cards" />
        </template>
        <template v-else-if="!failure && !rows.length">
            <p class="plugin-note">No plugins installed</p>
        </template>
        <template v-else-if="failure">
            <p class="plugin-note">{{ failure }}</p>
        </template>
        <template v-for="row in rows" :key="row.id">
            <div class="plugin" :data-row="row.id">
                <span class="plugin-head">
                    <span class="name">{{ row.title }}</span>
                    <span class="release">{{ row.release }}</span>
                    <button type="button" role="switch" :aria-checked="row.enabled" :aria-label="row.enabled ? 'Switch off' : 'Switch on'" :class="['toggle', {on: row.enabled}]" @click="switchOver(row)" />
                </span>
                <span class="plugin-source">{{ row.source }}</span>
                <template v-if="row.failing">
                    <span class="plugin-fault">{{ row.last_fault || "Failing" }}</span>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.plugins {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 12px;
}

.plugin {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
}

.plugin-head {
    display: flex;
    gap: 10px;
    align-items: center;
}

.name {
    flex: 1;
    font-weight: 500;
}

.release,
.plugin-source,
.plugin-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.plugin-fault {
    color: var(--danger);
    font-size: 12px;
}

.toggle {
    position: relative;
    flex: none;
    width: 30px;
    height: 17px;
    border: 0;
    border-radius: 9px;
    background: var(--raised);
    cursor: pointer;
}

.toggle::after {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    content: "";
    transition: transform 0.15s ease;
}

.toggle.on {
    background: var(--accent);
}

.toggle.on::after {
    transform: translateX(13px);
}
</style>
