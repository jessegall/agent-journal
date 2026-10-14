<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api.js";

const features = ref([]);
const load = async () => (features.value = await api.settings());

async function flip(feature) {
    await api.setSetting(`features.${feature.name}`, !feature.on);
    await load();
}

onMounted(load);
</script>

<template>
    <div class="page">
        <h1>Settings</h1>
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
