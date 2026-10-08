<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {useServiceAction} from "../../composables/service.js";
import {runsAllowed, runsOff} from "../runs.js";
import {RUNNING, stateWord} from "../../domain/services.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import {copyShown} from "../kit/toast.js";
import PhonePage from "./PhonePage.vue";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const page = ref(null);
const running = computed(() => Boolean(page.value) && RUNNING.includes(page.value.state));
const src = computed(() => (page.value && page.value.url ? api.pluginUrl(page.value, page.value.path) : ""));

async function load() {
    page.value = (await api.pages()).find((one) => `${one.plugin}.${one.name}` === props.target) || null;
}

const {error, set, busy} = useServiceAction(load);

const copyLink = () => copyShown(src.value, "link to this page");

onMounted(load);
</script>

<template>
    <PhonePage :title="page ? page.title : 'Plugin page'" line="A page a plugin adds. It runs on your computer." :back="back" @back="emit('back')">
        <template v-if="!page">
            <EmptyList icon="plug" title="Page not found" reason="No installed plugin adds this page." />
        </template>
        <template v-else-if="running && src">
            <iframe class="page-frame" :src="src" :title="page.title" />
            <CellGroup foot="Some pages only work on a computer. Copy the link and open it there.">
                <Cell label="Copy the link to this page" :chevron="false" @pick="copyLink" />
            </CellGroup>
        </template>
        <template v-else>
            <p class="page-why">{{ page.title }} is not running. Its service is {{ stateWord(page) }}.</p>
            <template v-if="error">
                <p class="page-why">{{ error }}</p>
            </template>
            <CellGroup :foot="runsOff">
                <template v-if="runsAllowed">
                    <Cell :label="busy(page.service, 'up') ? 'Starting…' : 'Start it'" tone="accent" :chevron="false" @pick="set(page.service, 'up')" />
                </template>
            </CellGroup>
        </template>
    </PhonePage>
</template>

<style scoped>
.page-frame {
    width: 100%;
    height: 60vh;
    margin-bottom: 14px;
    border: 0;
    border-radius: 12px;
    background: var(--raised);
}

.page-why {
    color: var(--text-2);
}
</style>
