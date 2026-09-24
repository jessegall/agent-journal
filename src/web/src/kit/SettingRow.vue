<script setup>
import Chip from "./Chip.vue";
import Icon from "./Icon.vue";

defineProps({
    title: {type: String, required: true},
    text: {type: String, default: ""},
    tag: {type: String, default: ""},
    opens: Boolean,
});
const emit = defineEmits(["open"]);
</script>

<template>
    <div
        :class="['setting-row', {opens}]"
        :role="opens ? 'button' : undefined"
        :tabindex="opens ? 0 : undefined"
        @click="opens && emit('open')"
        @keydown.enter.self="opens && emit('open')"
    >
        <div class="setting-row-text">
            <span class="setting-row-top">
                <span class="setting-row-title">{{ title }}</span>
                <template v-if="tag">
                    <Chip class="setting-row-tag">{{ tag }}</Chip>
                </template>
            </span>
            <template v-if="text">
                <span class="setting-row-help">{{ text }}</span>
            </template>
            <template v-if="$slots.default">
                <span class="setting-row-meta"><slot /></span>
            </template>
        </div>
        <template v-if="$slots.control">
            <div class="setting-row-control" @click.stop>
                <slot name="control" />
            </div>
        </template>
        <template v-if="opens">
            <Icon name="chevron" :size="12" class="setting-row-go" />
        </template>
    </div>
</template>

<style scoped>
.setting-row {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 52px;
    padding: 10px 16px;
}

.setting-row.opens {
    cursor: pointer;
}

.setting-row.opens:hover {
    background: var(--raised);
}

.setting-row.opens:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
}

.setting-row-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.setting-row-top {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.setting-row-title {
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.setting-row-tag {
    align-self: center;
    padding: 0 7px;
    font-size: 10.5px;
}

.setting-row-help {
    display: -webkit-box;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.setting-row-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
    color: var(--text-3);
    font-size: 11.5px;
}

.setting-row-meta:empty {
    display: none;
}

.setting-row-control {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
}

.setting-row-go {
    flex: none;
    color: var(--text-4);
}

.setting-row.opens:hover .setting-row-go {
    color: var(--text-2);
}

@media (max-width: 560px) {
    .setting-row-help {
        -webkit-line-clamp: 4;
    }
}
</style>
