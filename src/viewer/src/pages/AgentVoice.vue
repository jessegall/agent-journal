<script setup>
import {onMounted} from "vue";
import {callings, chooseVoice, loadVoices, voiceTitle, voices, voicesLoaded} from "../composables/voices.js";
import EmptyState from "../kit/EmptyState.vue";

onMounted(loadVoices);
</script>

<template>
    <div class="agent-voice">
        <template v-if="!voicesLoaded">
            <EmptyState loading>Loading the voices</EmptyState>
        </template>
        <div class="voices">
            <template v-for="voice in voices" :key="voice.name">
                <button type="button" :class="['voice', {chosen: voice.chosen}]" :aria-pressed="voice.chosen" @click="chooseVoice(voice)">
                    <span class="voice-head">
                        <span class="voice-emoji">{{ voice.emoji }}</span>
                        <span class="voice-name">{{ voiceTitle(voice) }}</span>
                        <template v-if="voice.chosen">
                            <span class="voice-chosen">In use</span>
                        </template>
                    </span>
                    <span class="voice-text">{{ voice.text }}</span>
                    <span class="voice-sample">“{{ voice.sample }}”</span>
                </button>
            </template>
        </div>
        <header class="agent-voice-name">
            <h2>Your title and name</h2>
            <p>Voices that use your title and name call you “{{ callings["title and name"] }}”.</p>
        </header>
    </div>
</template>

<style scoped>
.voices {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 10px;
}

.voice {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-2);
    text-align: left;
    cursor: pointer;
}

.voice:hover {
    border-color: var(--border-2);
}

.voice.chosen {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 10%, var(--raised));
}

.voice-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.voice-name {
    color: var(--text);
    font-weight: 500;
}

.voice-chosen {
    margin-left: auto;
    color: var(--accent-text);
    font-size: 11px;
}

.voice-text {
    font-size: 12px;
}

.voice-sample {
    color: var(--text-3);
    font-size: 12px;
    font-style: italic;
}

.agent-voice-name {
    margin-top: 18px;
}

.agent-voice-name h2 {
    margin: 0 0 4px;
    font-size: 13px;
}

.agent-voice-name p {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
