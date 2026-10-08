<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Console from "../kit/Console.vue";
import EmptyState from "../kit/EmptyState.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import StatTile from "../kit/StatTile.vue";
import StateDot from "../kit/StateDot.vue";
import {span} from "../format/time.js";
import {usePoll} from "../composables/poll.js";
import {useNow} from "../composables/now.js";
import {dotOf, isFailing, isRunning, stateWord} from "../domain/services.js";
import {ownerFeature, ownerTitle, useServiceAction, useServiceLog} from "../composables/service.js";

const props = defineProps({plugin: {type: String, default: ""}});

const EVERY = 2000;
const all = ref([]);
const loaded = ref(false);
const look = usePoll(
    "services-panel",
    () => api.services(),
    EVERY,
    (got) => {
        all.value = got || [];
        loaded.value = true;
    }
);
const services = computed(() => (props.plugin ? all.value.filter((s) => s.plugin === props.plugin) : all.value));

const now = useNow();
const {error, set, busy, working} = useServiceAction(() => look());
const {reading, log, read} = useServiceLog();
const toggle = (s) => (isRunning(s) ? "down" : "up");

const groups = computed(() => {
    const owners = [...new Set(services.value.map((s) => s.plugin))];
    return owners
        .map((name) => ({
            name,
            title: ownerTitle(name),
            kind: ownerFeature(name) ? "Part of the journal" : "Plugin",
            services: services.value.filter((s) => s.plugin === name),
        }))
        .sort((a, b) => Number(Boolean(ownerFeature(a.name))) - Number(Boolean(ownerFeature(b.name))));
});
const running = computed(() => services.value.filter(isRunning).length);
const failing = computed(() => services.value.filter(isFailing).length);
const stopped = computed(() => services.value.length - running.value - failing.value);
</script>

<template>
    <div class="services">
        <div class="tally">
            <StatTile label="Running" :value="running" tone="good" />
            <StatTile label="Stopped" :value="stopped" />
            <StatTile label="Failing" :value="failing" :tone="failing ? 'danger' : ''" />
        </div>
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
        <template v-if="!services.length">
            <EmptyState :loading="!loaded" title="Nothing runs yet">
                {{ plugin ? "This plugin declares no service." : "No plugin or feature on this project declares a service." }}
            </EmptyState>
        </template>
        <template v-for="group in groups" :key="group.name">
            <section class="group">
                <template v-if="!plugin">
                    <SectionHeading>
                        {{ group.title }}
                        <span class="kind">{{ group.kind }}</span>
                    </SectionHeading>
                </template>
                <template v-for="s in group.services" :key="s.id">
                    <article :class="['service', {failing: isFailing(s)}]">
                        <header class="service-head">
                            <StateDot :state="dotOf(s)" />
                            <span class="service-name">{{ s.service }}</span>
                            <span class="service-state">{{ stateWord(s) }}</span>
                            <template v-if="isRunning(s) && s.since">
                                <span class="uptime">up {{ span(now - s.since) }}</span>
                            </template>
                        </header>
                        <template v-if="s.why">
                            <p class="why">{{ s.why }}</p>
                        </template>
                        <template v-if="s.url">
                            <a class="url" :href="s.url" target="_blank" rel="noopener">{{ s.url }} ↗</a>
                        </template>
                        <footer class="service-acts">
                            <Btn small :busy="busy(s.id, toggle(s))" :disabled="working(s.id)" @click="set(s.id, toggle(s))">
                                {{ isRunning(s) ? "Stop" : "Start" }}
                            </Btn>
                            <Btn small :busy="busy(s.id, 'restart')" :disabled="working(s.id)" @click="set(s.id, 'restart')">
                                Restart
                            </Btn>
                            <Btn small @click="read(s.id)">{{ reading === s.id ? "Hide log" : "Show log" }}</Btn>
                            <span class="service-id">{{ s.id }}</span>
                        </footer>
                        <template v-if="reading === s.id">
                            <Console class="service-log" :text="log || 'Nothing is logged yet.'" />
                        </template>
                    </article>
                </template>
            </section>
        </template>
    </div>
</template>

<style scoped>
.services {
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.tally {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
}

.tally > * {
    min-width: 0;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.kind {
    margin-left: 6px;
    color: var(--text-4);
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
}

.service {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
}

.service.failing {
    border-color: color-mix(in srgb, var(--danger) 45%, var(--border-2));
}

.service-head {
    display: flex;
    align-items: center;
    gap: 9px;
}

.service-name {
    color: var(--text);
    font-size: 13.5px;
    font-weight: 600;
}

.service-state {
    color: var(--text-3);
    font-size: 12px;
}

.service.failing .service-state {
    color: var(--danger);
}

.uptime {
    margin-left: auto;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.why {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
    line-height: 1.45;
}

.url {
    align-self: flex-start;
    color: var(--accent-text);
    font-family: var(--mono);
    font-size: 11.5px;
    text-decoration: none;
}

.url:hover {
    text-decoration: underline;
}

.service-acts {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
}

.service-id {
    margin-left: auto;
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 11px;
}

.service-log {
    max-height: 260px;
}
</style>
