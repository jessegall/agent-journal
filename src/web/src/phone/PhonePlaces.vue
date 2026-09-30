<script setup>
import {nextTick, onMounted, ref} from "vue";
import {announce} from "./announce.js";
import {phone} from "../api/phone.js";
import Spinner from "../kit/Spinner.vue";
import PhoneSheet from "./PhoneSheet.vue";
import PhonePlaceList from "./PhonePlaceList.vue";
import PhonePlaceDetail from "./PhonePlaceDetail.vue";
import {CONTROLS, useDrag} from "./drag.js";

const EDGE = 24;
const COMMIT = 0.35;
const FLICK = 0.5;
const props = defineProps({environment: {type: String, required: true}});
const emit = defineEmits(["close", "moved", "switching", "stayed"]);
const places = ref(null);
const at = ref("");
const busy = ref("");
const told = ref("");
const chosen = ref(null);
const forward = ref(true);
const pane = ref(null);
const pulled = ref(0);

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

let tapped = "";

function pick(place, name) {
    tapped = `${place.root}:${name}`;
    forward.value = true;
    told.value = "";
    chosen.value = {place, name};
}

function back() {
    forward.value = false;
    pulled.value = 0;
    chosen.value = null;
    nextTick(() => setTimeout(() => [...document.querySelectorAll(".place-row")].find((row) => row.dataset.place === tapped)?.focus({preventScroll: true}), 320));
}

useDrag(pane, {
    axis: "x",
    begin: (event, first) => (chosen.value && first.clientX <= EDGE && !event.target.closest(CONTROLS) ? {} : null),
    accepts: (d) => d > 0,
    move: (d) => (pulled.value = Math.max(0, d)),
    end: (d, v) => {
        if (d > COMMIT * (pane.value?.offsetWidth || 1) || v > FLICK) return back();
        pulled.value = 0;
    },
});

async function switched(work, what) {
    busy.value = what;
    told.value = "";
    emit("switching");
    try {
        await work();
        emit("moved");
    } catch (error) {
        emit("stayed");
        told.value = error.message;
    } finally {
        busy.value = "";
    }
}

function open(close) {
    const {place, name} = chosen.value;
    if (here(place, name)) return close();
    switched(() => phone.move(place.root, name), "open");
}

function start(agent) {
    const {place, name} = chosen.value;
    announce(`Starting ${agent.label}`);
    switched(() => phone.start(place.root, name, agent.key), agent.key);
}
</script>

<template>
    <PhoneSheet v-slot="{close}" label="Switch journal or environment" :body-drag="!chosen" :tall="Boolean(chosen)" @close="emit('close')">
        <template v-if="told">
            <p class="places-told" role="status">{{ told }}</p>
        </template>
        <template v-if="!places && !told">
            <div class="places-wait"><Spinner /></div>
        </template>
        <div class="places-track">
            <Transition :name="forward ? 'drill-in' : 'drill-out'">
                <template v-if="chosen">
                    <div ref="pane" :key="`${chosen.place.root}:${chosen.name}`" :class="['places-pane', {pulling: pulled > 0}]" :style="{transform: pulled ? `translateX(${pulled}px)` : ''}">
                        <PhonePlaceDetail :place="chosen.place" :name="chosen.name" :current="here(chosen.place, chosen.name)" :busy="busy" @back="back" @open="open(close)" @start="start" />
                    </div>
                </template>
                <template v-else>
                    <div key="list" class="places-pane">
                        <h2 class="places-title">Journals and environments</h2>
                        <PhonePlaceList :places="places || []" :here="here" @pick="pick" />
                        <button type="button" class="places-close" @click="close">Close</button>
                    </div>
                </template>
            </Transition>
        </div>
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

.places-track {
    position: relative;
    overflow-x: clip;
}

.places-pane {
    display: flex;
    flex-direction: column;
    transition: transform 300ms var(--spring);
}

.places-pane.pulling {
    transition: none;
}

.drill-in-enter-active,
.drill-in-leave-active,
.drill-out-enter-active,
.drill-out-leave-active {
    transition: transform var(--pop) var(--push), opacity var(--pop) linear;
}

.drill-in-leave-active,
.drill-out-leave-active {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
}

.drill-in-enter-from,
.drill-out-leave-to {
    transform: translateX(100%);
}

.drill-in-leave-to,
.drill-out-enter-from {
    opacity: 0;
    transform: translateX(-30%);
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
