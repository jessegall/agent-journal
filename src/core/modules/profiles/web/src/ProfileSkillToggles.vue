<script setup>
import {computed, ref, watch} from "vue";
import {Btn, Notice, SearchBar, SkeletonLine, matchesSearch, useWindow} from "@journal/window-kit";
import ProfileSkillRow from "./ProfileSkillRow.vue";

// every skill with a switch for the profile's agents; a switch changes the lists the panel saves, and switching a skill off takes its Required mark with it
const SEARCH_FROM = 8;
const SKELETON_ROWS = 3;
const props = defineProps({profile: {type: String, required: true}, chosen: {type: Array, default: null}, requiredChosen: {type: Array, default: null}});
const emit = defineEmits(["change", "change-required", "count"]);
const context = useWindow();
const rows = ref([]);
const failure = ref("");
const loaded = ref(false);
const query = ref("");
const on = computed(() => new Set(props.chosen ?? rows.value.filter((row) => row.state === "on").map((row) => row.key)));
const required = computed(() => new Set(props.requiredChosen ?? rows.value.filter((row) => row.required).map((row) => row.key)));
const matching = computed(() => {
    const words = query.value.toLowerCase().split(/\s+/).filter(Boolean);
    return rows.value.filter((row) => words.every((word) => matchesSearch(row, word, ["key", "description"])));
});
const countLine = computed(() => `${on.value.size} of ${rows.value.length} on${required.value.size ? `, ${required.value.size} required` : ""}`);

async function load() {
    loaded.value = false;
    context.state["skills.profile"] = props.profile;
    await context.reload("skills");
    const prop = context.props.skills;
    failure.value = prop.failure.value;
    rows.value = failure.value ? [] : prop.data.value.rows;
    loaded.value = true;
}

const inOrder = (keys) => rows.value.filter((row) => keys.has(row.key)).map((row) => row.key);

function toggle(row, wanted) {
    const next = new Set(on.value);
    if (wanted) next.add(row.key);
    else next.delete(row.key);
    emit("change", inOrder(next));
    if (!wanted && required.value.has(row.key)) mark(row, false);
}

function mark(row, wanted) {
    const next = new Set(required.value);
    if (wanted) next.add(row.key);
    else next.delete(row.key);
    emit("change-required", inOrder(next));
}

watch(() => props.profile, load, {immediate: true});
watch(() => on.value.size, (count) => emit("count", count), {immediate: true});
</script>

<template>
    <div class="profile-skills" data-profile-skills>
        <div class="profile-skills-line">
            <span class="profile-skills-help">Changing a skill here saves the whole list.</span>
            <template v-if="loaded && rows.length">
                <span class="profile-skills-count" data-profile-skill-count>{{ countLine }}</span>
            </template>
        </div>
        <template v-if="rows.length > SEARCH_FROM">
            <SearchBar v-model="query" data-profile-skill-find />
        </template>
        <template v-if="failure">
            <Notice tone="danger">
                <span role="alert">{{ failure }}</span>
                <Btn variant="ghost" small data-profile-skills-retry @click="load">Try again</Btn>
            </Notice>
        </template>
        <template v-else>
            <div class="profile-skills-card">
                <template v-if="!loaded">
                    <template v-for="line in SKELETON_ROWS" :key="line">
                        <div class="profile-skills-skeleton"><SkeletonLine /></div>
                    </template>
                </template>
                <template v-else-if="!rows.length">
                    <p class="profile-skills-note">No skills are installed.</p>
                </template>
                <template v-else-if="!matching.length">
                    <p class="profile-skills-note">No skill matches that.</p>
                </template>
                <template v-else>
                    <template v-for="row in matching" :key="row.key">
                        <ProfileSkillRow :row="row" :on="on.has(row.key)" :required="required.has(row.key)" @toggle="toggle(row, $event)" @require="mark(row, $event)" />
                    </template>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.profile-skills {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.profile-skills-line {
    display: flex;
    gap: 12px;
    align-items: baseline;
    justify-content: space-between;
}

.profile-skills-help,
.profile-skills-count,
.profile-skills-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.profile-skills-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-2);
}

.profile-skills-skeleton,
.profile-skills-note {
    padding: 10px 12px;
}
</style>
