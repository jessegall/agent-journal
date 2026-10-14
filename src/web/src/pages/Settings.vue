<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api.js";

const features = ref([]);
const voice = ref(null);
const title = ref("");
const name = ref("");
const load = async () => {
    [features.value, voice.value] = await Promise.all([api.settings(), api.voice()]);
    title.value = voice.value.title;
    name.value = voice.value.name;
};

async function choose(which) {
    await api.setSetting("voice.profile", which);
    await load();
}

async function saveMe() {
    await api.setSetting("voice.title", title.value);
    await api.setSetting("voice.name", name.value);
    await load();
}

async function flip(feature) {
    await api.setSetting(`features.${feature.name}`, !feature.on);
    await load();
}

onMounted(load);
</script>

<template>
    <div class="page">
        <h1>Settings</h1>
        <h2>How the agent talks to you</h2>
        <template v-if="voice">
            <div v-for="v in voice.voices" :key="v.name" class="switch">
                <div>
                    <div>{{ v.name }}</div>
                    <div class="help">{{ v.sample }}</div>
                </div>
                <button :class="['btn', {primary: voice.chosen === v.name}]" type="button" @click="choose(v.name)">{{ voice.chosen === v.name ? "Chosen" : "Choose" }}</button>
            </div>
            <form class="add" @submit.prevent="saveMe">
                <input v-model="title" class="field" placeholder="Your title, such as Sir" />
                <input v-model="name" class="field" placeholder="Your first name" />
                <button class="btn" type="submit">Save</button>
            </form>
        </template>
        <h2>Features</h2>
        <div v-for="f in features" :key="f.name" class="switch">
            <div>
                <div>{{ f.title }}</div>
                <div class="help">{{ f.nudges.length }} lines it can say<template v-if="f.states.length"> · states: {{ f.states.join(", ").replaceAll("_", " ") }}</template></div>
            </div>
            <button :class="['btn', {primary: f.on}]" type="button" @click="flip(f)">{{ f.on ? "On" : "Off" }}</button>
        </div>
    </div>
</template>
