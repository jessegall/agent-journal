<script setup>
import {computed, ref} from "vue";
import {RowList, useRows, useWindow} from "@journal/window-kit";

const context = useWindow();
const {rows: loaded, failure} = useRows(`agent-skill list --agent ${context.agent}`, ["agent_skill.*"]);
const newestLast = computed(() => [...loaded.value].reverse());
const view = ref("loaded");
const catalogue = ref([]);
const opened = ref(null);
const openFailure = ref("");

async function browse() {
    const result = await context.read("skill list");
    catalogue.value = result.ok ? result.value.rows : [];
    openFailure.value = result.ok ? "" : result.error;
    view.value = "catalogue";
}

async function open(folder) {
    const result = await context.read(`skill show ${folder}`);
    openFailure.value = result.ok ? "" : result.error;
    opened.value = result.ok ? result.value : null;
    view.value = "text";
}
</script>

<template>
    <div class="skills">
        <template v-if="view === 'text'">
            <button type="button" class="skills-back" @click="view = 'loaded'">Back</button>
            <template v-if="opened">
                <h3 class="skills-title">{{ opened.folder }}</h3>
                <pre class="skills-text">{{ opened.text }}</pre>
            </template>
            <p v-else class="skills-failure">{{ openFailure }}</p>
        </template>
        <template v-else-if="view === 'catalogue'">
            <button type="button" class="skills-back" @click="view = 'loaded'">Back</button>
            <ul class="skills-catalogue">
                <template v-for="skill in catalogue" :key="skill.folder">
                    <li>
                        <button type="button" class="skill-entry" @click="open(skill.folder)">
                            <span class="skill-name">{{ skill.folder }}</span>
                            <span class="skill-description">{{ skill.description }}</span>
                        </button>
                    </li>
                </template>
            </ul>
        </template>
        <template v-else>
            <p class="skills-note">Loaded in this window, newest last. Compacting the conversation empties it.</p>
            <RowList :rows="newestLast" :failure="failure" empty="No skill is loaded in this conversation.">
                <template #default="{row}">
                    <button type="button" class="skill-row" @click="open(row.skill)">
                        <svg class="skill-book" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
                            <path d="M3 2.5h7a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2z" />
                            <path d="M3 11.5a2 2 0 0 1 2-2h7" />
                        </svg>
                        {{ row.skill }}
                    </button>
                </template>
            </RowList>
            <button type="button" class="skills-browse" @click="browse">Browse every skill</button>
        </template>
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

.skill-row,
.skill-entry {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    text-align: left;
}

.skill-description {
    color: var(--text-3);
    font-size: 12px;
}

.skills-text {
    white-space: pre-wrap;
    font-size: 12px;
}

.skills-catalogue {
    margin: 0;
    padding: 0;
    list-style: none;
}
</style>
