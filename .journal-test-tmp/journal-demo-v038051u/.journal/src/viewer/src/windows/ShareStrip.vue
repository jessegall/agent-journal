<script setup>
import Icon from "../kit/Icon.vue";

defineProps({
    icon: {type: String, required: true},
    noun: {type: String, required: true},
    facts: {type: Array, default: () => []},
    ends: {type: String, default: ""},
    read: {type: Number, default: -1},
});
</script>

<template>
    <header class="share-strip">
        <span class="badge"><Icon :name="icon" :size="13" /></span>
        <span class="noun">Shared {{ noun }}</span>
        <template v-for="fact in facts" :key="fact">
            <span class="fact">{{ fact }}</span>
        </template>
        <span class="grow" />
        <span class="access"><Icon name="lock" :size="12" />View only</span>
        <template v-if="ends">
            <span class="ends">Link ends {{ ends }}</span>
        </template>
        <template v-if="read >= 0">
            <span class="read" :style="{transform: `scaleX(${read})`}" />
        </template>
    </header>
</template>

<style scoped>
.share-strip {
    position: relative;
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 46px;
    padding: 0 18px;
    border-bottom: 1px solid var(--border);
    background: var(--side);
    color: var(--text-3);
    font-size: 12px;
}

.badge {
    display: grid;
    flex: none;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: color-mix(in srgb, var(--kind) 18%, transparent);
    color: var(--kind);
}

.noun {
    flex: none;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.fact {
    flex: none;
    white-space: nowrap;
}

.fact::before {
    margin-right: 10px;
    color: var(--text-4);
    content: "·";
}

.grow {
    flex: 1;
}

.access {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    color: var(--text-2);
    white-space: nowrap;
}

.ends {
    flex: none;
    white-space: nowrap;
}

.read {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: var(--kind);
    transform-origin: left;
    transition: transform 0.12s linear;
}

@media (max-width: 700px) {
    .share-strip {
        gap: 8px;
        padding: 0 12px;
    }

    .fact,
    .ends {
        display: none;
    }
}
</style>
