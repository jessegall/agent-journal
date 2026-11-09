<script setup>
import {Switch} from "@journal/window-kit";

// one skill of a profile: its switch, its name and what it is for, and at the end the Required toggle while it is on, or the note that every agent reads it
defineProps({row: {type: Object, required: true}, on: Boolean, required: Boolean});
const emit = defineEmits(["toggle", "require"]);
</script>

<template>
    <div :class="['profile-skill', {off: !on}]" :data-profile-skill="row.key">
        <Switch :on="on" :disabled="row.locked" :title="`Give ${row.key} to this profile's agents`" data-profile-skill-switch @change="emit('toggle', $event)" />
        <span class="profile-skill-text">
            <span class="profile-skill-head">
                <span class="profile-skill-name">{{ row.key }}</span>
                <template v-if="row.own"><span class="profile-skill-own" data-profile-skill-own>Made for this type</span></template>
            </span>
            <span class="profile-skill-about" :title="row.description">{{ row.description }}</span>
        </span>
        <span class="profile-skill-end">
            <template v-if="row.locked">
                <span class="profile-skill-locked" data-profile-skill-locked>Every agent reads this at the start</span>
            </template>
            <template v-else-if="on">
                <Switch labelled small word="Required" :on="required" :title="`Require ${row.key} at the start`" data-profile-skill-required @change="emit('require', $event)" />
            </template>
        </span>
    </div>
</template>

<style scoped>
.profile-skill {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px 12px;
}

.profile-skill + .profile-skill {
    border-top: 1px solid var(--border);
}

.profile-skill-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.profile-skill-head {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}

.profile-skill-name {
    color: var(--text);
    font-size: 13px;
}

.profile-skill.off .profile-skill-name {
    color: var(--text-3);
}

.profile-skill-own {
    padding: 0 5px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    color: var(--text-3);
    font-size: 10px;
}

.profile-skill-about {
    display: -webkit-box;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.profile-skill-end {
    display: flex;
    flex: none;
    justify-content: flex-end;
    min-width: 84px;
}

.profile-skill-locked {
    max-width: 130px;
    color: var(--text-3);
    font-size: 11.5px;
    text-align: right;
}

@media (max-width: 640px) {
    .profile-skill {
        flex-wrap: wrap;
    }

    .profile-skill-end {
        justify-content: flex-start;
        width: 100%;
        padding-left: 38px;
    }
}
</style>
