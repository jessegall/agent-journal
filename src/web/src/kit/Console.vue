<script setup>
defineProps({text: {type: String, default: ""}});
</script>

<template>
    <div class="console">
        <div class="console-body">
            <slot>
                <span class="console-text">{{ text }}</span>
            </slot>
        </div>
    </div>
</template>

<style scoped>
.console {
    display: flex;
    flex-direction: column-reverse;
    max-height: 340px;
    overflow-y: auto;
    padding: 8px 10px;
    border-radius: 7px;
    background: var(--code-bg);
    color: var(--text-2);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    line-height: 1.55;
}

.console-body {
    display: flex;
    flex-direction: column;
}

.console-text {
    white-space: pre-wrap;
    word-break: break-word;
}
</style>
