<script setup>
import {computed} from "vue";
import {RowList} from "@journal/window-kit";

const props = defineProps({rows: {type: Array, required: true}, failure: {type: String, default: ""}, answered: {type: Boolean, required: true}});
const emit = defineEmits(["open", "browse"]);
const newestLast = computed(() => [...props.rows].reverse());
</script>

<template>
    <div class="skills">
        <p class="skills-note">Loaded in this window, newest last. Compacting the conversation empties it.</p>
        <RowList :rows="newestLast" :failure="failure" :loaded="answered" empty="No skill is loaded in this conversation.">
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
        <button type="button" class="skills-browse" @click="emit('browse')">Browse every skill</button>
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
}
</style>
