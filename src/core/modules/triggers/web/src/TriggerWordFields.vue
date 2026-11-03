<script setup>
import {MATCHES, PLACES} from "./triggerWords.js";
import TriggerTiles from "./TriggerTiles.vue";
import WatchedWords from "./WatchedWords.vue";

// the words a trigger watches for, where it looks and how they match
const phrases = defineModel("phrases", {type: Array, required: true});
const places = defineModel("places", {type: Array, required: true});
const match = defineModel("match", {type: String, required: true});
const togglePlace = (key) => (places.value = places.value.includes(key) ? places.value.filter((place) => place !== key) : [...places.value, key]);
</script>

<template>
    <div class="field"><span class="label">When these words appear</span><WatchedWords :words="phrases" @words="phrases = $event" /></div>
    <div class="field">
        <span class="label">Where to look</span>
        <template v-for="place in PLACES" :key="place.key">
            <label class="check"><input type="checkbox" :checked="places.includes(place.key)" :data-trigger-place="place.key" @change="togglePlace(place.key)">{{ place.label }}</label>
        </template>
    </div>
    <div class="field">
        <span class="label">How words match</span>
        <TriggerTiles v-model="match" :options="MATCHES" mark="trigger-match" />
        <template v-if="match === 'pattern'">
            <p class="pattern-limit" data-trigger-pattern-limit>Patterns have no time limit. A slow pattern can delay every command or file change. Patterns are limited to 200 characters and check only the first 2,000 characters; repeating a repeated group is refused.</p>
        </template>
    </div>
</template>

<style scoped src="./triggerForm.css"></style>
<style scoped>
.pattern-limit { margin: 0; color: var(--text-3); font-size: 12px; line-height: 1.5; }
</style>
