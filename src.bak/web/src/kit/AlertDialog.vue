<script setup>
defineProps({title: {type: String, required: true}});
</script>

<template>
    <div class="alert-root">
        <section class="alert-dialog" role="alertdialog" aria-modal="true" :aria-label="title">
            <div class="alert-body">
                <h2>{{ title }}</h2>
                <slot />
            </div>
            <footer class="alert-actions">
                <slot name="actions" />
            </footer>
        </section>
    </div>
</template>

<style scoped>
.alert-root {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgb(0 0 0 / 42%);
}

.alert-dialog {
    width: min(280px, 100%);
    overflow: hidden;
    border-radius: 14px;
    background: var(--raised);
    box-shadow: var(--card-shadow);
}

.alert-body {
    padding: 20px 16px 18px;
    text-align: center;
}

.alert-body h2 {
    margin: 0 0 8px;
    font-size: 1rem;
}

.alert-body :deep(p) {
    margin: 0;
    color: var(--text-2);
    font-size: 0.882rem;
    line-height: 1.4;
}

.alert-actions {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    border-top: 1px solid var(--line);
}

.alert-actions :deep(button) {
    min-height: 48px;
    padding: 0 10px;
    border: 0;
    background: transparent;
    color: var(--accent-text);
    font: inherit;
}

.alert-actions :deep(button + button) {
    border-left: 1px solid var(--line);
}
</style>
