<script setup>
import {computed} from "vue";
import {RowList} from "@journal/window-kit";

const props = defineProps({rows: {type: Array, required: true}, failure: {type: String, default: ""}, answered: {type: Boolean, required: true}});
const emit = defineEmits(["open"]);
const newestLast = computed(() => [...props.rows].reverse());
</script>

<template>
    <div class="skills" data-skills-loaded>
        <h2>Loaded by the main agent</h2>
        <p class="skills-note">The skills the main agent has read in this conversation.</p>
        <RowList :rows="newestLast" :failure="failure" :loaded="answered" empty="No skill is loaded in this conversation." hint="Skills appear here with the time the agent read them.">
            <template #default="{row}">
                <button type="button" class="skill-row" @click="emit('open', row.skill)">
                    <svg class="skill-book" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
                        <path d="M3 2.5h7a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2z" />
                        <path d="M3 11.5a2 2 0 0 1 2-2h7" />
                    </svg>
                    {{ row.skill }}
                </button>
            </template>
        </RowList>
    </div>
</template>

<style scoped>
.skills {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skills-note {
    margin: 0;
    font-size: 12px;
    color: var(--text-3);
}

.skill-row {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    text-align: left;
    padding: 8px 10px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    cursor: pointer;
}
.skill-row:hover { background: var(--hover); color: var(--text); }
h2 { margin: 0; font-size: 13px; font-weight: 600; }
</style>
