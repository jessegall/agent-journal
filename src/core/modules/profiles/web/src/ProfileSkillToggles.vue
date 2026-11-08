<script setup>
import {computed, ref, watch} from "vue";
import {Switch, useWindow} from "@journal/window-kit";

// every skill with a switch for the profile's agents, the ones made for the profile's own type marked; a switch changes the list the panel saves
const props = defineProps({profile: {type: String, required: true}, chosen: {type: Array, default: null}});
const emit = defineEmits(["change"]);
const context = useWindow();
const rows = ref([]);
const failure = ref("");
const on = computed(() => new Set(props.chosen ?? rows.value.filter((row) => row.state === "on").map((row) => row.key)));

async function load() {
    context.state["skills.profile"] = props.profile;
    await context.reload("skills");
    const prop = context.props.skills;
    failure.value = prop.failure.value;
    rows.value = failure.value ? [] : prop.data.value.rows;
}

function toggle(row, wanted) {
    const next = new Set(on.value);
    if (wanted) next.add(row.key);
    else next.delete(row.key);
    emit("change", rows.value.filter((each) => next.has(each.key)).map((each) => each.key));
}

watch(() => props.profile, load, {immediate: true});
</script>

<template>
    <div class="profile-skills" data-profile-skills>
        <template v-if="failure">
            <p class="profile-skills-note" role="alert">{{ failure }}</p>
        </template>
        <template v-for="row in rows" :key="row.key">
            <div class="profile-skill" :data-profile-skill="row.key">
                <Switch :on="on.has(row.key)" :title="`Give ${row.key} to this profile's agents`" data-profile-skill-switch @change="toggle(row, $event)" />
                <span class="profile-skill-text">
                    <span class="profile-skill-name">{{ row.key }}</span>
                    <template v-if="row.own"><span class="profile-skill-own" data-profile-skill-own>Made for this type</span></template>
                    <span class="profile-skill-about">{{ row.description }}</span>
                </span>
            </div>
        </template>
    </div>
</template>

<style scoped>
.profile-skills {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.profile-skill {
    display: flex;
    gap: 10px;
    align-items: flex-start;
}

.profile-skill-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    font-size: 13px;
}

.profile-skill-own {
    color: var(--accent);
    font-size: 11.5px;
}

.profile-skill-about,
.profile-skills-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
