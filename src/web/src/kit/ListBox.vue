<script setup>
defineProps({
    title: {type: String, default: ""},
    count: {type: [Number, String], default: ""},
    tone: {type: String, default: ""},
});
</script>

<template>
    <section :class="['list-box', tone]">
        <template v-if="title">
            <header class="list-box-head">
                <span class="list-box-title">{{ title }}</span>
                <template v-if="count !== ''">
                    <span class="list-box-count">{{ count }}</span>
                </template>
            </header>
        </template>
        <div class="list-box-rows">
            <slot />
        </div>
    </section>
</template>

<style scoped>
.list-box {
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
    overflow: hidden;
}

.list-box.warn {
    border-color: color-mix(in srgb, var(--tone-warn) 30%, var(--border));
    box-shadow: inset 3px 0 0 var(--tone-warn);
}

.list-box-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 12px 18px 4px;
}

.list-box-title {
    color: var(--text-2);
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.list-box.warn .list-box-title {
    color: var(--tone-warn);
}

.list-box-count {
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.list-box-rows > :deep(* + *) {
    border-top: 1px solid var(--line);
}
</style>
