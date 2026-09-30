<script setup>
import {onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import Spinner from "../kit/Spinner.vue";

const props = defineProps({environment: {type: String, required: true}});
const emit = defineEmits(["close", "moved"]);
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

async function move(place, name) {
    if (here(place, name)) return emit("close");
    moving.value = `${place.root}:${name}`;
    try {
        await phone.move(place.root, name);
        emit("moved");
    } catch (error) {
        told.value = error.message;
    } finally {
        moving.value = "";
    }
}
</script>

<template>
    <div class="places-backdrop" @click.self="emit('close')">
        <div class="places-sheet" role="dialog" aria-label="Switch journal or environment">
            <span class="places-title">Switch journal or environment</span>
            <template v-if="told">
                <p class="places-told">{{ told }}</p>
            </template>
            <template v-if="!places && !told">
                <Spinner />
            </template>
            <template v-for="place in places || []" :key="place.root">
                <div class="places-journal">
                    <span class="places-name">
                        <span class="places-dot" :style="{background: place.color}" />
                        {{ place.project }}
                    </span>
                    <div class="places-environments">
                        <template v-for="name in place.environments" :key="name">
                            <button
                                type="button"
                                :class="['places-environment', {here: here(place, name)}]"
                                :disabled="Boolean(moving)"
                                @click="move(place, name)"
                            >
                                {{ name }}
                            </button>
                        </template>
                    </div>
                </div>
            </template>
            <button type="button" class="places-close" @click="emit('close')">Close</button>
        </div>
    </div>
</template>

<style scoped>
.places-backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: flex;
    align-items: flex-end;
    max-width: none;
    background: rgb(0 0 0 / 45%);
}

.places-sheet {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    max-width: none;
    max-height: 80vh;
    padding: 16px var(--side) calc(14px + env(safe-area-inset-bottom));
    overflow-y: auto;
    border-radius: 16px 16px 0 0;
    background: var(--raised);
}

.places-title {
    color: var(--text-3);
    font-size: 13px;
}

.places-told {
    margin: 0;
    color: var(--text-2);
    font-size: 14px;
}

.places-journal {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.places-name {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text);
    font-size: 16px;
    font-weight: 600;
}

.places-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
}

.places-environments {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.places-environment {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 15px;
}

.places-environment.here {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--text);
}

.places-close {
    min-height: 44px;
    border: 0;
    background: transparent;
    color: var(--text-3);
    font: inherit;
}
</style>
