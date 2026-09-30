<script setup>
import {onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Spinner from "../kit/Spinner.vue";
import PhoneSheet from "./PhoneSheet.vue";

const props = defineProps({environment: {type: String, required: true}});
const emit = defineEmits(["close", "moved", "switching", "stayed"]);
const places = ref(null);
const at = ref("");
const moving = ref("");
const told = ref("");

onMounted(async () => {
    try {
        const got = await phone.places();
        places.value = got.places;
        at.value = got.at;
    } catch (error) {
        told.value = error.message;
    }
});

const here = (place, name) => place.root === at.value && name === props.environment;

const AGENTS = [
    {key: "claude", label: "Claude"},
    {key: "codex", label: "Codex"},
];

async function start(place, name, agent) {
    moving.value = `${place.root}:${name}`;
    told.value = "";
    emit("switching");
    try {
        await phone.start(place.root, name, agent);
        emit("moved");
    } catch (error) {
        emit("stayed");
        told.value = error.message;
    } finally {
        moving.value = "";
    }
}

async function move(place, name) {
    if (here(place, name)) return emit("close");
    moving.value = `${place.root}:${name}`;
    emit("switching");
    try {
        await phone.move(place.root, name);
        emit("moved");
    } catch (error) {
        emit("stayed");
        told.value = error.message;
    } finally {
        moving.value = "";
    }
}
</script>

<template>
    <PhoneSheet v-slot="{close}" label="Switch journal or environment" @close="emit('close')">
        <h2 class="places-title">Switch journal or environment</h2>
        <template v-if="told">
            <p class="places-told" role="status">{{ told }}</p>
        </template>
        <template v-if="!places && !told">
            <div class="places-wait"><Spinner /></div>
        </template>
        <template v-for="place in places || []" :key="place.root">
            <section class="places-journal">
                <h3 class="places-name">
                    <span class="places-dot" :style="{background: place.color}" />
                    <span class="places-project">{{ place.project }}</span>
                    <template v-if="!place.running">
                        <span class="places-off">not running</span>
                    </template>
                </h3>
                <ul class="places-environments">
                    <template v-for="name in place.environments" :key="name">
                        <li class="places-row">
                            <button
                                type="button"
                                :class="['places-environment', {here: here(place, name)}]"
                                :aria-current="here(place, name) ? 'true' : undefined"
                                :disabled="Boolean(moving)"
                                @click="here(place, name) ? close() : move(place, name)"
                            >
                                <span :class="['places-state', {working: place.working.includes(name)}]" />
                                <span class="places-env-name">{{ name }}</span>
                                <template v-if="here(place, name)">
                                    <span class="places-here">Open</span>
                                </template>
                            </button>
                            <template v-if="!place.working.includes(name)">
                                <span class="places-starts">
                                    <template v-for="agent in AGENTS" :key="agent.key">
                                        <button type="button" class="places-start" :disabled="Boolean(moving)" @click="start(place, name, agent.key)">
                                            Start {{ agent.label }}
                                        </button>
                                    </template>
                                </span>
                            </template>
                        </li>
                    </template>
                </ul>
            </section>
        </template>
        <button type="button" class="places-close" @click="close">Close</button>
    </PhoneSheet>
</template>

<style scoped>
.places-title {
    margin: 4px 0 12px;
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
}

.places-told {
    margin: 0 0 12px;
    color: var(--text-2);
    font-size: 0.882rem;
}

.places-wait {
    display: flex;
    justify-content: center;
    padding: 16px;
}

.places-journal {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 20px;
}

.places-name {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0 16px;
    color: var(--text-3);
    font-size: 0.765rem;
    font-weight: 400;
}

.places-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
}

.places-off {
    color: var(--text-3);
}

.places-environments {
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
    list-style: none;
}

.places-row + .places-row {
    border-top: 1px solid var(--line);
}

.places-environment {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 44px;
    padding: 10px 16px;
    border: 0;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 1rem;
    text-align: left;
}

.places-env-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.places-project {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.places-here {
    color: var(--accent-text);
    font-size: 0.882rem;
}

.places-state {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-4);
}

.places-state.working {
    background: var(--tone-good);
}

.places-starts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 16px 10px 34px;
}

.places-start {
    min-height: 36px;
    padding: 0 14px;
    border: 0;
    border-radius: 18px;
    background: var(--accent-dim);
    color: var(--accent-text);
    font: inherit;
    font-size: 0.882rem;
    font-weight: 600;
}

.places-close {
    min-height: 50px;
    margin-top: 4px;
    border: 0;
    border-radius: 12px;
    background: var(--hover);
    color: var(--text);
    font: inherit;
    font-size: 1rem;
    font-weight: 600;
}
</style>
