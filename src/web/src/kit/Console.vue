<script setup>
defineProps({text: {type: String, default: ""}, fill: {type: Boolean, default: false}});
</script>

<template>
    <div :class="['console', {fill}]">
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

.console.fill {
    flex: 1;
    max-height: none;
    margin: 0 -14px -14px;
    padding: 12px 14px;
    border-radius: 0;
}

.console.fill:first-child {
    margin-top: -14px;
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
