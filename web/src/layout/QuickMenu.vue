<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import {saveSettings} from "../api.js";
import Icon from "../kit/Icon.vue";
import {go, peek, route} from "../route.js";
import {autoOn, meta, navTypes, store, types, unreadByUser} from "../store.js";

const emit = defineEmits(["close"]);
const q = ref("");
const i = ref(0);
const input = ref(null);
onMounted(() => input.value && input.value.focus());

function focusThread(draft) {
    const area = document.querySelector(".thread textarea");
    if (!area) return false;
    if (draft) {
        area.value = draft;
        area.dispatchEvent(new Event("input", {bubbles: true}));
    }
    area.focus();
    area.setSelectionRange(area.value.length, area.value.length);
    return true;
}

async function write(draft) {
    emit("close");
    if (focusThread(draft)) return;
    go(route.value.env);
    for (let tries = 0; tries < 20 && !focusThread(draft); tries++) await new Promise((r) => setTimeout(r, 50));
}

const goTo = (page) => () => {
    emit("close");
    go(route.value.env, page);
};

async function setAuto(on) {
    emit("close");
    await saveSettings(route.value.env, {features: {auto: on}});
}

const waiting = computed(() => types.value.filter((t) => t.attention).flatMap((t) => unreadByUser(t.name)));
const commands = computed(() => {
    const pages = [
        {page: "", label: "Home", icon: "home"},
        ...navTypes("environment").map((t) => ({page: t.name, label: meta(t.name).title + "s", icon: t.icon})),
    ];
    const rows = pages.map((p, n) => ({label: `Go to ${p.label}`, keys: p.label, hk: String(n + 1), icon: p.icon, run: goTo(p.page)}));
    rows.push({label: "Go to Settings", keys: "settings preferences", icon: "settings", run: goTo("settings")});
    rows.push({label: "Search", keys: "search find", icon: "search", run: goTo("search")});
    if (waiting.value.length) {
        const first = waiting.value[0];
        rows.unshift({
            label: `Answer the first of ${waiting.value.length} waiting on you`,
            keys: "answer waiting",
            hk: "a",
            icon: "questions",
            run: () => {
                emit("close");
                peek(first.type, first.n);
            },
        });
    }
    rows.push({
        label: autoOn.value ? "Pause auto mode" : "Resume auto mode",
        keys: "auto mode",
        icon: "auto",
        run: () => setAuto(!autoOn.value),
    });
    rows.push({
        label: store.activity ? "Hide the activity column" : "Show the activity column",
        keys: "activity column",
        icon: "activity",
        run: () => {
            emit("close");
            store.activity = !store.activity;
        },
    });
    return rows;
});

const rows = computed(() => {
    const needle = q.value.trim().toLowerCase();
    const found = commands.value.filter((c) => !needle || `${c.label} ${c.keys}`.toLowerCase().includes(needle));
    if (!needle) return [{label: "Message the agent", hk: "space", icon: "arrow", run: () => write("")}, ...found];
    return [...found, {label: `Message the agent: “${q.value.trim()}”`, icon: "arrow", run: () => write(q.value.trim())}];
});
const cursor = computed(() => Math.max(0, Math.min(i.value, rows.value.length - 1)));

function onKey(e) {
    if (e.isComposing) return;
    const hot =
        !q.value && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && rows.value.find((r) => r.hk === e.key.toLowerCase());
    if (e.key === " " && !q.value) {
        e.preventDefault();
        write("");
    } else if (hot) {
        e.preventDefault();
        e.stopPropagation();
        hot.run();
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        i.value = Math.min(cursor.value + 1, rows.value.length - 1);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        i.value = Math.max(cursor.value - 1, 0);
    } else if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (rows.value[cursor.value]) rows.value[cursor.value].run();
    } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        emit("close");
    }
}

function onInput(e) {
    q.value = e.target.value;
    i.value = 0;
}
</script>

<template>
    <div class="quick-shell">
        <div class="quick-scrim" @click="emit('close')" />
        <div class="quick-menu" role="dialog" aria-label="Quick menu">
            <div class="quick-head">
                <Icon name="search" />
                <input
                    ref="input"
                    class="quick-input"
                    :value="q"
                    placeholder="Search actions…"
                    aria-label="Search actions"
                    @input="onInput"
                    @keydown="onKey"
                />
                <button type="button" class="quick-key" @click="emit('close')">esc</button>
            </div>
            <div class="quick-rows">
                <template v-for="(r, n) in rows" :key="r.label">
                    <button type="button" :class="['quick-row', {on: n === cursor}]" @click="r.run" @mouseenter="i = n">
                        <Icon :name="r.icon" />
                        <span class="quick-label">{{ r.label }}</span>
                        <template v-if="r.hk">
                            <span class="quick-cap">{{ r.hk }}</span>
                        </template>
                    </button>
                </template>
            </div>
            <div class="quick-foot">
                <span>↑↓ move</span>
                <span>↵ run</span>
                <span class="quick-foot-note">
                    {{ q.trim() ? `${rows.length} ${rows.length === 1 ? "match" : "matches"}` : "press a key, or search" }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.quick-scrim {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(4, 5, 6, 0.62);
}

.quick-menu {
    position: fixed;
    z-index: 51;
    top: 92px;
    left: 50%;
    transform: translateX(-50%);
    width: min(580px, calc(100% - 56px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #33363d;
    border-radius: 14px;
    background: #151619;
    box-shadow: 0 26px 64px rgba(0, 0, 0, 0.6);
}

.quick-head {
    flex: none;
    display: flex;
    align-items: center;
    gap: 11px;
    height: 54px;
    padding: 0 15px;
    border-bottom: 1px solid var(--border);
}

.quick-head .ico {
    flex: none;
    width: 15px;
    height: 15px;
    color: var(--text-3);
}

.quick-input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 14px;
    outline: none;
}

.quick-key {
    flex: none;
    display: inline-flex;
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
    cursor: pointer;
}

.quick-rows {
    flex: 1;
    min-height: 0;
    max-height: 294px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 6px;
}

.quick-row {
    display: flex;
    align-items: center;
    gap: 10px;
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

.quick-row .ico {
    flex: none;
    width: 14px;
    height: 14px;
    color: var(--text-3);
}

.quick-row.on .ico {
    color: var(--accent-text);
}

.quick-label {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.quick-cap {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    padding: 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    color: var(--text-3);
    font-size: 10.5px;
    line-height: 1;
    white-space: nowrap;
}

.quick-row.on .quick-cap {
    border-color: #3a3d44;
    color: #c3c7fb;
}

.quick-foot {
    flex: none;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 9px 15px;
    border-top: 1px solid var(--border);
    background: #121316;
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
}

.quick-foot-note {
    margin-left: auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
