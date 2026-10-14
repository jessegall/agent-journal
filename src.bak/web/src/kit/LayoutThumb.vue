<script setup>
import {percentBox} from "../format/number.js";

defineProps({cells: {type: Array, required: true}});
</script>

<template>
    <span class="layout-thumb" aria-hidden="true">
        <template v-for="(c, at) in cells" :key="at">
            <span :class="['layout-cell', c.view]" :style="percentBox(c.box)">
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

.layout-cell.terminal i {
    background: #0b0c0e;
    box-shadow: inset 0 0 0 1px var(--border-3);
}

.layout-cell.agents i {
    background:
        linear-gradient(90deg, transparent 30%, var(--bg) 30% 36%, transparent 36% 64%, var(--bg) 64% 70%, transparent 70%),
        linear-gradient(transparent 30%, var(--bg) 30% 36%, transparent 36% 64%, var(--bg) 64% 70%, transparent 70%),
        color-mix(in srgb, var(--tone-good) 50%, transparent);
}

.layout-cell.feed i {
    background: color-mix(in srgb, var(--add-fg) 45%, transparent);
}
</style>
