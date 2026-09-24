<script setup>
defineProps({
    kind: {type: String, default: ""},
    title: {type: String, default: ""},
    text: {type: String, default: ""},
});
</script>

<template>
    <div class="list-row">
        <template v-if="kind">
            <span class="list-row-kind">{{ kind }}</span>
        </template>
        <div class="list-row-main">
            <template v-if="title">
                <span class="list-row-title">{{ title }}</span>
            </template>
            <div class="list-row-body">
                <slot />
            </div>
            <template v-if="$slots.end">
                <div class="list-row-end">
                    <slot name="end" />
                </div>
            </template>
        </div>
        <template v-if="text">
            <span class="list-row-text">{{ text }}</span>
        </template>
    </div>
</template>

<style scoped>
.list-row {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px 16px;
}

.list-row::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 2px;
    background: var(--text-3);
    opacity: 0.5;
}

.list-row:hover {
    background: var(--raised);
}

.list-row:hover::before {
    opacity: 1;
}

.list-row-kind {
    color: var(--text-3);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.list-row-main {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 18px;
    min-width: 0;
}

.list-row-title {
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.list-row-body {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 18px;
    min-width: 0;
    font-size: 13px;
}

.list-row-end {
    flex: none;
    margin-left: auto;
}

.list-row-text {
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
