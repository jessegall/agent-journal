<script setup>
defineProps({
    href: {type: String, default: ""},
    label: {type: String, default: ""},
    tone: {type: String, default: ""},
    wide: Boolean,
});
</script>

<template>
    <article :class="['tile', tone, {wide}]">
        <div class="tile-main">
            <template v-if="href">
                <a class="tile-cover" :href="href" :aria-label="label" />
            </template>
            <div class="tile-body">
                <slot />
            </div>
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
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
    overflow: hidden;
    transition:
        border-color 0.15s,
        background 0.15s;
}

.tile:has(.tile-cover:hover) {
    border-color: var(--border-3);
    background: var(--hover);
}

.tile.live {
    box-shadow: inset 0 2px 0 var(--progress);
}

.tile.quiet {
    opacity: 0.6;
}

.tile.wide {
    grid-column: 1 / -1;
}

.tile-main {
    position: relative;
    flex: 1;
}

.tile-cover {
    position: absolute;
    inset: 0;
    border-radius: inherit;
}

.tile-cover:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
}

.tile-body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    height: 100%;
    padding: 16px 18px 14px;
    pointer-events: none;
}

.tile-body :deep(a),
.tile-body :deep(button) {
    pointer-events: auto;
}

.tile-more {
    border-top: 1px solid var(--line);
    background: var(--bg-2);
}
</style>
