<script setup>
import PhoneNavRow from "./PhoneNavRow.vue";
import {SILENT, SILENT_WORD} from "../domain/agentState.js";

defineProps({places: {type: Array, required: true}, here: {type: Function, required: true}});
const silent = (place, name) => place.details?.[name]?.agent === SILENT;
const emit = defineEmits(["pick"]);
</script>

<template>
    <div class="place-list">
        <template v-for="place in places" :key="place.root">
            <section class="place-journal" :aria-label="place.project">
                <h3 class="place-name">
                    <span class="place-dot" :style="{background: place.color}" />
                    <span class="place-project">{{ place.project }}</span>
                    <template v-if="!place.running">
                        <span class="place-off">not running</span>
                    </template>
                </h3>
                <ul class="place-rows">
                    <template v-for="name in place.environments" :key="name">
                        <li>
                            <PhoneNavRow
                                class="place-row"
                                :data-place="`${place.root}:${name}`"
                                :aria-current="here(place, name) ? 'true' : undefined"
                                @click="emit('pick', place, name)"
                            >
                                <span :class="['place-state', {working: place.working.includes(name), silent: silent(place, name)}]" />
                                <span class="place-env">{{ name }}</span>
                                <template v-if="silent(place, name)">
                                    <span class="place-silent">{{ SILENT_WORD }}</span>
                                </template>
                                <template v-if="here(place, name)">
                                    <span class="place-here">Current</span>
                                </template>
                            </PhoneNavRow>
                        </li>
                    </template>
                </ul>
            </section>
        </template>
    </div>
</template>

<style scoped>
.place-journal {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 20px;
}

.place-name {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0 16px;
    color: var(--text-3);
    font-size: 0.765rem;
    font-weight: 400;
}

.place-dot {
    flex: none;
    width: 9px;
    height: 9px;
    border-radius: 50%;
}

.place-project {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.place-rows {
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
    list-style: none;
}

.place-rows li + li {
    border-top: 1px solid var(--line);
}

.place-row {
    min-height: 48px;
    padding: 10px 16px;
    font-size: 1rem;
}

.place-state {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-4);
}

.place-state.working {
    background: var(--tone-good);
}

.place-state.silent {
    background: var(--tone-warn);
}

.place-silent {
    flex: none;
    color: var(--tone-warn);
    font-size: 0.765rem;
    font-weight: 600;
}

.place-env {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.place-here {
    color: var(--accent-text);
    font-size: 0.824rem;
}
</style>
