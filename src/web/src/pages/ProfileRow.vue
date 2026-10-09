<script setup>
import {artOf, calls, sampleOf} from "../composables/profiles.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import Illustration from "../kit/Illustration.vue";
import ProfileMenu from "./ProfileMenu.vue";

defineProps({row: {type: Object, required: true}, inUse: Boolean, standing: Boolean});
defineEmits(["open", "use", "duplicate", "remove"]);
</script>

<template>
    <div :class="['profile-row', {current: inUse || standing}]">
        <Illustration :src="artOf(row)" :size="56" />
        <button type="button" class="profile-row-main" @click="$emit('open', row)">
            <span class="profile-row-name">
                {{ row.title }}
                <template v-if="inUse">
                    <Chip tone="good">In use</Chip>
                </template>
                <template v-else-if="standing">
                    <Chip>In use until you choose</Chip>
                </template>
            </span>
            <span class="profile-row-sample">“{{ sampleOf(row) }}”</span>
            <span class="profile-row-calls">{{ calls(row) ? `Calls you ${calls(row)}` : "Doesn't use your name" }}</span>
        </button>
        <span class="profile-row-actions">
            <template v-if="!inUse">
                <Btn small @click="$emit('use', row)">Use this profile</Btn>
            </template>
            <Btn small @click="$emit('open', row)">{{ row.data.system ? "View" : "Edit" }}</Btn>
            <ProfileMenu :row="row" @duplicate="$emit('duplicate', $event)" @remove="$emit('remove', $event)" />
        </span>
    </div>
</template>

<style scoped>
.profile-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    border-top: 1px solid var(--border);
}

.profile-row.current {
    background: color-mix(in srgb, var(--accent) 7%, transparent);
}

.profile-row-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.profile-row-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    font-weight: 500;
}

.profile-row-sample {
    color: var(--text-2);
    font-size: 12.5px;
}

.profile-row-calls {
    color: var(--text-3);
    font-size: 11.5px;
}

.profile-row-actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;
}
</style>
