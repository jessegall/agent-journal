<script setup>
import {ref} from "vue";
import {PAGES, href, route} from "../route.js";
import {api} from "../api.js";

const props = defineProps({environments: Array, agents: Array, questions: Number});
const naming = ref(false);
const name = ref("");
const live = (env) => props.agents.some((a) => a.environment_id === env.id && a.state !== "ended");

async function create() {
    if (!name.value.trim()) return;
    await api.newEnvironment(name.value.trim());
    window.location.hash = href(name.value.trim());
    naming.value = false;
    name.value = "";
}
</script>

<template>
    <aside class="side">
        <div class="project">Agent journal</div>
        <a v-for="p in PAGES" :key="p.key" :class="['item', {on: route.page === p.key}]" :href="href(route.env, p.key)">
            <span>{{ p.title }}</span>
            <span v-if="p.key === 'home' && questions" class="count hot">{{ questions }}</span>
        </a>
        <div class="group">Environments</div>
        <a v-for="e in environments" :key="e.id" :class="['item', {on: route.env === e.name}]" :href="href(e.name, route.page)">
            <span><span :class="['dot', {live: live(e)}]" />{{ e.name }}</span>
        </a>
        <form v-if="naming" class="add" @submit.prevent="create">
            <input v-model="name" class="field" placeholder="name" autofocus />
        </form>
        <a v-else class="item" href="#" @click.prevent="naming = true"><span>+ New environment</span></a>
        <div class="foot">version 4</div>
    </aside>
</template>
