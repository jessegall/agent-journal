<script setup>
defineProps({title: {type: String, required: true}});
</script>

<template>
    <section class="part">
        <h3>{{ title }}</h3>
        <slot />
    </section>
</template>

<style scoped>
.part {
    margin-bottom: 22px;
}

h3 {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

:slotted(p),
:slotted(dd) {
    margin: 0 0 8px;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
}

:slotted(dt) {
    margin-top: 8px;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
}

:slotted(dd) {
    margin-left: 0;
}

:slotted(pre) {
    overflow-x: auto;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    font-size: 11.5px;
    line-height: 1.5;
}

:slotted(code) {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
}
</style>
