<script setup>
defineProps({
    href: {type: String, default: ""},
    label: {type: String, default: ""},
    wide: Boolean,
    opens: Boolean,
    compact: Boolean,
});
const emit = defineEmits(["open"]);
</script>

<template>
    <article :class="['tile', {wide, compact}]">
        <div class="tile-main">
            <template v-if="href">
                <a class="tile-cover" :href="href" :aria-label="label" />
            </template>
            <template v-else-if="opens">
                <button type="button" class="tile-cover" :aria-label="label" :title="label" @click="emit('open')" />
            </template>
            <template v-if="$slots.head">
                <div class="tile-head">
                    <slot name="head" />
                </div>
            </template>
            <div class="tile-body">
                <slot />
            </div>
            <template v-if="$slots.foot">
                <div class="tile-foot">
                    <slot name="foot" />
                </div>
            </template>
        </div>
        <template v-if="$slots.more">
            <div class="tile-more">
                <slot name="more" />
            </div>
        </template>
    </article>
</template>

<style scoped>
.tile {
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--bg);
}

.tile.wide {
    grid-column: 1 / -1;
}

.tile-main {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    transition: background 0.15s;
}

.tile-main:has(> .tile-cover:hover) {
    background: var(--raised);
}

.tile-cover {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
}

.tile-cover:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
}

.tile-head,
.tile-body,
.tile-foot {
    position: relative;
    pointer-events: none;
}

.tile-head :deep(a),
.tile-head :deep(button),
.tile-body :deep(a),
.tile-body :deep(button),
.tile-foot :deep(a),
.tile-foot :deep(button) {
    pointer-events: auto;
}

.tile-head {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 40px;
    padding: 0 10px 0 16px;
    border-bottom: 1px solid var(--line);
}

.tile-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px 14px;
}

.tile-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 14px;
    min-height: 34px;
    padding: 4px 10px 4px 16px;
    border-top: 1px solid var(--line);
    font-size: 11.5px;
}

.tile-more {
    border-top: 1px solid var(--border);
    background: var(--bg-2);
}

.tile.compact {
    overflow: hidden;
}

.tile.compact .tile-main {
    min-height: 0;
}

.tile.compact .tile-head {
    min-height: 32px;
    padding: 0 10px 0 12px;
}

.tile.compact .tile-body {
    gap: 4px;
    min-height: 0;
    padding: 8px 12px;
    overflow: hidden;
}

.tile.compact .tile-foot {
    min-height: 0;
    padding: 4px 10px 6px 12px;
}
</style>
