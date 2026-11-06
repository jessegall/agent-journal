<script setup>
// one choice in the column of whose memories to read: a name, a line under it, and how many memories it holds
defineProps({name: {type: String, required: true}, meta: {type: String, default: ""}, count: {type: [Number, String], default: ""}, selected: Boolean, mark: {type: String, default: ""}});
defineEmits(["pick"]);
</script>

<template>
    <button type="button" :class="['who', {selected, main: mark === 'main'}]" :aria-current="selected" data-who @click="$emit('pick')">
        <template v-if="mark">
            <span :class="['who-mark', mark]" />
        </template>
        <span class="who-text">
            <span class="who-name" data-who-name>{{ name }}</span>
            <template v-if="meta || $slots.meta">
                <span class="who-meta"><slot name="meta">{{ meta }}</slot></span>
            </template>
        </span>
        <span class="who-count">{{ count }}</span>
    </button>
</template>

<style scoped>
.who {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    min-height: 32px;
    padding: 5px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.who:hover {
    background: var(--hover);
    color: var(--text);
}

.who.selected {
    background: var(--sel);
    color: var(--text);
}

.who.main {
    min-height: 44px;
    color: var(--text);
}

.who.main .who-name {
    font-weight: 600;
}

.who:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
}

.who-mark {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.who-mark.main {
    background: var(--accent);
}

.who-mark.live {
    width: 6px;
    height: 6px;
    background: var(--tone-good);
}

.who-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.who-name,
.who-meta {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.who-meta {
    color: var(--text-3);
    font-size: 11.5px;
}

.who-count {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

@media (max-width: 720px) {
    .who {
        min-height: 44px;
    }
}
</style>
