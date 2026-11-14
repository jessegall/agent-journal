<script setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import MarkIcon from "../kit/MarkIcon.vue";

// version 4's quick menu: every action of the page in one list to search, walk with the arrows, or run by its key
const props = defineProps({commands: {type: Array, required: true}});
const emit = defineEmits(["close", "message"]);
const query = ref("");
const at = ref(0);
const input = ref(null);

const rows = computed(() => {
    const wanted = query.value.trim().toLowerCase();
    const found = props.commands.filter((command) => !wanted || `${command.label} ${command.keys ?? ""}`.toLowerCase().includes(wanted));
    return wanted ? [...found, {label: `Message the agent: “${query.value.trim()}”`, icon: "arrow", run: () => emit("message", query.value.trim())}] : found;
});
const cursor = computed(() => Math.max(0, Math.min(at.value, rows.value.length - 1)));

function run(row) {
    emit("close");
    row.run();
}

function keyed(event) {
    if (event.isComposing) return;
    const hot = !query.value && event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey && rows.value.find((row) => row.key === event.key.toLowerCase());
    if (hot) return event.preventDefault(), run(hot);
    if (event.key === "ArrowDown") return event.preventDefault(), (at.value = Math.min(cursor.value + 1, rows.value.length - 1));
    if (event.key === "ArrowUp") return event.preventDefault(), (at.value = Math.max(cursor.value - 1, 0));
    if (event.key === "Enter") return event.preventDefault(), rows.value[cursor.value] && run(rows.value[cursor.value]);
    if (event.key === "Escape") return event.preventDefault(), event.stopPropagation(), emit("close");
}

watch(cursor, () => nextTick(() => document.querySelector(".quick-row.on")?.scrollIntoView?.({block: "nearest"})));
onMounted(() => input.value?.focus());
</script>

<template>
    <Teleport to="body">
        <div class="quick-scrim" @click="emit('close')" />
        <div class="quick-menu" role="dialog" aria-label="Quick menu" data-quick-menu>
            <div class="quick-head">
                <Icon name="search" />
                <input ref="input" v-model="query" class="quick-input" placeholder="Search actions…" aria-label="Search actions" @input="at = 0" @keydown="keyed" />
                <button type="button" class="quick-key" @click="emit('close')">esc</button>
            </div>
            <div class="quick-rows">
                <template v-for="(row, index) in rows" :key="row.label">
                    <button type="button" :class="['quick-row', {on: index === cursor}]" data-quick-row @click="run(row)" @mouseenter="at = index">
                        <template v-if="row.markIcon">
                            <MarkIcon :name="row.markIcon" />
                        </template>
                        <template v-else>
                            <Icon :name="row.icon" />
                        </template>
                        <span class="quick-label">{{ row.label }}</span>
                        <template v-if="row.key">
                            <span class="quick-cap">{{ row.key }}</span>
                        </template>
                    </button>
                </template>
            </div>
            <div class="quick-foot">
                <span>↑↓ move</span>
                <span>↵ run</span>
                <span class="quick-foot-note">{{ query.trim() ? `${rows.length} ${rows.length === 1 ? "match" : "matches"}` : "press a key, or search" }}</span>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.quick-scrim {
    position: fixed;
    z-index: 50;
    inset: 0;
    background: rgba(4, 5, 6, 0.62);
}

.quick-menu {
    position: fixed;
    z-index: 51;
    top: 92px;
    left: 50%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: min(580px, calc(100% - 56px));
    border: 1px solid var(--border-2);
    border-radius: 14px;
    background: var(--raised);
    box-shadow: 0 26px 64px rgba(0, 0, 0, 0.6);
    transform: translateX(-50%);
}

.quick-head {
    display: flex;
    flex: none;
    gap: 11px;
    align-items: center;
    height: 54px;
    padding: 0 15px;
    border-bottom: 1px solid var(--border);
}

.quick-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 14px;
}

.quick-key,
.quick-cap {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    height: 20px;
    padding: 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    background: transparent;
    color: var(--text-3);
    font: inherit;
    font-size: 10.5px;
}

.quick-key {
    cursor: pointer;
}

.quick-rows {
    flex: none;
    overflow-x: hidden;
    overflow-y: auto;
    height: 330px;
    padding: 6px;
}

.quick-row {
    display: flex;
    gap: 10px;
    align-items: center;
    scroll-margin-block: 40px;
    width: 100%;
    height: 38px;
    padding: 0 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.quick-row.on {
    background: var(--sel);
    color: var(--text);
}

.quick-label {
    flex: 1;
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.quick-foot {
    display: flex;
    flex: none;
    gap: 14px;
    align-items: center;
    height: 34px;
    padding: 0 15px;
    border-top: 1px solid var(--border);
    color: var(--text-4);
    font-size: 11px;
}

.quick-foot-note {
    margin-left: auto;
}
</style>
