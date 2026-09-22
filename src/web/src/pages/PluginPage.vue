<script setup>
import Console from "../kit/Console.vue";
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {usePoll} from "../poll.js";
import {RUNNING} from "../domain/services.js";
import {useServiceAction} from "../composables/service.js";

const refreshPages = usePoll(...polled.pages);

const pages = computed(() => store.pages || []);
const log = ref("");

const page = computed(() => pages.value.find((p) => `${p.plugin}.${p.name}` === String(route.value.n)) || null);
const running = computed(() => !!page.value && RUNNING.includes(page.value.state));
const src = computed(() => {
    if (!page.value || !page.value.url) return "";
    return api.pluginUrl(page.value, route.value.at || page.value.path);
});

const {error, set} = useServiceAction(() => refreshPages());
const runPluginAction = (want) => page.value && set(page.value.service, want);

async function read() {
    if (!page.value) return;
    log.value = (await api.serviceLog(page.value.service)).log;
}

watch(
    () => route.value.n,
    () => (log.value = "")
);
</script>

<template>
    <template v-if="running && src">
        <iframe class="plugin-frame" :src="src" :title="page.title" />
    </template>
    <template v-else>
        <section class="down">
            <template v-if="error">
                <p class="why">{{ error }}</p>
            </template>
            <template v-else-if="!page">
                <p class="why">No plugin page is installed under that name.</p>
            </template>
            <template v-else>
                <p class="why">
                    <Icon name="plug" />
                    {{ page.title }} is not running: its service {{ page.service }} is {{ page.state }}.
                </p>
                <span class="acts">
                    <Btn kind="primary" small @click="runPluginAction('up')">Start it</Btn>
                    <Btn small @click="read">Read the log</Btn>
                    <template v-if="page.url">
                        <a class="out" :href="page.url" target="_blank">Open in a new tab</a>
                    </template>
                </span>
                <template v-if="log">
                    <Console :text="log" />
                </template>
            </template>
        </section>
    </template>
</template>

<style scoped>
.plugin-frame {
    flex: 1;
    width: 100%;
    height: 100%;
    border: 0;
    background: var(--bg);
}

.down {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
}

.why {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-2);
}

.acts {
    display: flex;
    align-items: center;
    gap: 8px;
}

.out {
    color: var(--accent-text);
    font-size: 12px;
}
</style>
