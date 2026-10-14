<script setup>
import {computed, onMounted, ref, watch} from "vue";
import Sidebar from "./kit/Sidebar.vue";
import Home from "./pages/Home.vue";
import Tasks from "./pages/Tasks.vue";
import Plans from "./pages/Plans.vue";
import Memory from "./pages/Memory.vue";
import Timeline from "./pages/Timeline.vue";
import Settings from "./pages/Settings.vue";
import {route} from "./route.js";
import {live, startLive} from "./live.js";
import {api} from "./api.js";

const pages = {home: Home, tasks: Tasks, plans: Plans, memory: Memory, timeline: Timeline, settings: Settings};
const page = computed(() => pages[route.page] || Home);
const environments = ref([]);
const agents = ref([]);
const unread = ref(0);
const openQuestions = ref(0);

async function refresh() {
    environments.value = await api.environments();
    agents.value = await api.agents();
    const [messages, questions] = await Promise.all([api.messages(50), api.questions()]);
    unread.value = messages.filter((m) => m.author === "agent" && !m.read_at).length;
    openQuestions.value = questions.filter((q) => q.answer === null).length;
}

onMounted(() => {
    startLive();
    refresh();
});
watch(() => live.version, refresh);
</script>

<template>
    <div class="app">
        <Sidebar :environments="environments" :agents="agents" :questions="openQuestions" />
        <main class="main">
            <component :is="page" :key="route.env + route.page" />
        </main>
        <div v-if="!live.online" class="offline">The journal is not answering</div>
    </div>
</template>
