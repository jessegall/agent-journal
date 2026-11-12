<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {SearchBar} from "@journal/window-kit";

// Find a setting: a field that lists the settings whose title or description holds every word typed, each with where it
// lives in words. Pressing / with no field in focus moves to it; the arrows move over the list, Enter opens the one in
// focus (the first when none was moved to), Escape closes it. Opening one is the window's to do: it gets the entry.
const MOST_SHOWN = 8;
const props = defineProps({index: {type: Array, required: true}, placeholder: {type: String, default: "Find a setting"}});
const emit = defineEmits(["pick"]);

const query = ref("");
const chosen = ref(0);
const bar = ref(null);
const root = ref(null);

const words = computed(() => query.value.toLowerCase().split(/\s+/).filter(Boolean));
const matches = computed(() => (words.value.length ? props.index.filter((entry) => words.value.every((word) => `${entry.title} ${entry.description}`.toLowerCase().includes(word))).slice(0, MOST_SHOWN) : []));
const isOpen = computed(() => words.value.length > 0);

watch(query, () => { chosen.value = 0; });

function pick(entry) {
    query.value = "";
    emit("pick", entry);
}

function move(by) {
    if (matches.value.length) chosen.value = (chosen.value + by + matches.value.length) % matches.value.length;
}

function key(event) {
    if (event.key === "ArrowDown") return void (event.preventDefault(), move(1));
    if (event.key === "ArrowUp") return void (event.preventDefault(), move(-1));
    if (event.key === "Enter" && matches.value[chosen.value]) return void (event.preventDefault(), pick(matches.value[chosen.value]));
    if (event.key === "Escape") query.value = "";
}

const typing = (element) => element instanceof HTMLElement && (["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName) || element.isContentEditable);

function slash(event) {
    if (event.key !== "/" || typing(document.activeElement) || event.metaKey || event.ctrlKey || event.altKey) return;
    event.preventDefault();
    bar.value?.focus();
}

onMounted(() => document.addEventListener("keydown", slash));
onBeforeUnmount(() => document.removeEventListener("keydown", slash));
</script>

<template>
    <div ref="root" class="setting-find" data-setting-find @keydown="key">
        <SearchBar ref="bar" v-model="query" :placeholder="placeholder" />
        <template v-if="isOpen">
            <ul class="list" role="listbox" data-find-list>
                <template v-for="(entry, place) in matches" :key="entry.key">
                    <li :class="['entry', {on: place === chosen}]" role="option" :aria-selected="place === chosen" :data-find-entry="entry.key" @mousedown.prevent="pick(entry)" @mousemove="chosen = place">
                        <span class="title">{{ entry.title }}</span>
                        <span class="path">{{ entry.path }}</span>
                    </li>
                </template>
                <template v-if="!matches.length">
                    <li class="none" data-find-none>No setting matches that.</li>
                </template>
            </ul>
        </template>
    </div>
</template>

<style scoped>
.setting-find { position: relative; width: 280px; }
.list { position: absolute; z-index: 5; top: calc(100% + 4px); right: 0; width: 360px; margin: 0; padding: 4px; list-style: none; border: 1px solid var(--border-2); border-radius: 8px; background: var(--raised); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); }
.entry { display: flex; flex-direction: column; gap: 2px; padding: 7px 10px; border-radius: 6px; cursor: pointer; }
.entry.on { background: var(--sel); }
.title { color: var(--text); font-size: 12.5px; }
.path { color: var(--text-3); font-size: 11.5px; }
.none { padding: 8px 10px; color: var(--text-3); font-size: 12px; }
</style>
