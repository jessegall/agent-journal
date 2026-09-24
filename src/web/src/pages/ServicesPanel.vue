<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Console from "../kit/Console.vue";
import EmptyState from "../kit/EmptyState.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import SidePanel from "../kit/SidePanel.vue";
import StatTile from "../kit/StatTile.vue";
import StateDot from "../kit/StateDot.vue";
import {span} from "../format/time.js";
import {store} from "../state/store.js";
import {useNow} from "../composables/now.js";
import {dotOf, isFailing, isRunning, stateWord} from "../domain/services.js";
import {useServiceAction, useServiceLog} from "../composables/service.js";

const props = defineProps({
    services: {type: Array, required: true},
    plugins: {type: Array, required: true},
    focus: {type: String, default: ""},
});
const emit = defineEmits(["close", "refresh"]);

const now = useNow();
const {error, set, busy, working} = useServiceAction(() => emit("refresh"));
const {reading, log, read} = useServiceLog();
const toggle = (s) => (isRunning(s) ? "down" : "up");

const groups = computed(() => {
    const owners = [...new Set(props.services.map((s) => s.plugin))];
    const feature = (name) => (store.spec && store.spec.features ? store.spec.features[name] : null);
    const plugin = (name) => props.plugins.find((p) => p.name === name);
    const titleOf = (name) => (feature(name) || plugin(name) || {}).title || name;
    return owners
        .map((name) => ({
            name,
            title: titleOf(name),
            kind: feature(name) ? "Part of the journal" : "Plugin",
            services: props.services.filter((s) => s.plugin === name),
        }))
        .sort((a, b) => Number(Boolean(feature(a.name))) - Number(Boolean(feature(b.name))));
});
const running = computed(() => props.services.filter(isRunning).length);
const failing = computed(() => props.services.filter(isFailing).length);
const stopped = computed(() => props.services.length - running.value - failing.value);

const body = ref(null);

onMounted(async () => {
    await nextTick();
    const focused = body.value && body.value.querySelector(".group.focused");
    if (focused) focused.scrollIntoView({block: "start", behavior: "smooth"});
});
</script>

<template>
    <SidePanel title="Services" abstract="The processes the journal and its plugins keep running." @close="emit('close')">
        <div ref="body" class="services">
            <div class="tally">
                <StatTile label="Running" :value="running" tone="good" />
                <StatTile label="Stopped" :value="stopped" />
                <StatTile label="Failing" :value="failing" :tone="failing ? 'danger' : ''" />
            </div>
            <template v-if="error">
                <p class="error">{{ error }}</p>
            </template>
            <template v-if="!services.length">
                <EmptyState title="Nothing runs yet">No plugin or feature on this project declares a service.</EmptyState>
            </template>
            <template v-for="group in groups" :key="group.name">
                <section :class="['group', {focused: group.name === focus}]">
                    <SectionHeading>
                        {{ group.title }}
                        <span class="kind">{{ group.kind }}</span>
                    </SectionHeading>
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
    </SidePanel>
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
    scroll-margin-top: 12px;
}

.kind {
    margin-left: 6px;
    color: var(--text-4);
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
}

.group.focused .service {
    border-color: color-mix(in srgb, var(--accent) 55%, var(--border-2));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent);
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
