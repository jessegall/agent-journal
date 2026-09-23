<script setup>
defineProps({
    title: {type: String, required: true},
    note: {type: String, default: ""},
    text: {type: String, default: ""},
});
</script>

<template>
    <div class="list-row">
        <slot name="lead" />
        <div class="list-row-names">
            <span class="list-row-title">{{ title }}</span>
            <template v-if="note">
                <span class="list-row-note">{{ note }}</span>
            </template>
        </div>
        <div class="list-row-body">
            <template v-if="text">
                <span class="list-row-text">{{ text }}</span>
            </template>
            <slot />
        </div>
        <template v-if="$slots.end">
            <div class="list-row-end">
                <slot name="end" />
            </div>
        </template>
    </div>
</template>

<style scoped>
.list-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 14px;
    min-height: 48px;
    padding: 9px 18px;
}

.list-row-names {
    display: flex;
    flex-direction: column;
    gap: 1px;
    width: 190px;
    min-width: 0;
}

.list-row-title {
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.list-row-note {
    overflow: hidden;
    color: var(--text-3);
    font-size: 11.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.list-row-body {
    display: flex;
    flex: 1 1 260px;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 18px;
    min-width: 0;
}

.list-row-text {
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.list-row-end {
    flex: none;
    margin-left: auto;
}
</style>
