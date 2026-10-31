<script setup>
import {percentBox} from "../format/number.js";

defineProps({cells: {type: Array, required: true}});
const CHAT = "messages.chat";
</script>

<template>
    <span class="layout-thumb" aria-hidden="true">
        <template v-for="(c, at) in cells" :key="at">
            <span :class="['layout-cell', c.view === CHAT ? 'chat' : `module-${c.view.split('.')[0]}`]" :style="percentBox(c.box)">
                <i />
            </span>
        </template>
    </span>
</template>

<style scoped>
.layout-thumb {
    position: relative;
    flex: none;
    width: 46px;
    height: 32px;
    overflow: hidden;
    border: 1px solid var(--border-3);
    border-radius: 4px;
    background: var(--bg);
}

.layout-cell {
    position: absolute;
}

.layout-cell i {
    position: absolute;
    inset: 1.5px;
    border-radius: 2px;
    background: var(--border-2);
}

.layout-cell.chat i {
    background: color-mix(in srgb, var(--accent) 55%, transparent);
}

.layout-cell.module-agents i {
    background: color-mix(in srgb, var(--tone-good) 50%, transparent);
}

.layout-cell.module-coding i {
    background: color-mix(in srgb, var(--add-fg) 45%, transparent);
}
</style>
