<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, MenuItem, MenuPanel} from "@journal/window-kit";

// one saved secret: every card has the same rows whatever is configured, so they all stand at one height; changing it happens in its dialog
const ICONS = {"api key": "key", login: "lock", custom: "rows"};
const LABELS = {"api key": "API key", login: "Login", custom: "Custom"};
const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["update", "delete"]);
const more = ref(null);
const menu = ref(false);
const programs = computed(() => (props.row.programs.length ? props.row.programs.join(", ") : "none"));

function pick() {
    menu.value = false;
    emit("delete");
}
</script>

<template>
    <article class="secret" :data-row="row.id">
        <header class="head">
            <span class="mark" aria-hidden="true"><Icon :name="ICONS[row.secret_type]" :size="18" /></span>
            <span class="names">
                <span class="title">{{ row.title }}</span>
                <span class="type">{{ LABELS[row.secret_type] }}</span>
            </span>
        </header>
        <p class="note" :title="row.brief">{{ row.brief || "Note: none" }}</p>
        <p class="meta" data-secret-programs :title="programs">Programs: {{ programs }}</p>
        <p class="meta" data-secret-helpers-line>Helpers: {{ row.helpers ? "can use it" : "cannot use it" }}</p>
        <footer class="acts">
            <Btn small bordered data-secret-update @click="emit('update')">Edit secret</Btn>
            <span ref="more" class="more">
                <Btn variant="icon" small title="Secret options" data-secret-more @click.stop="menu = !menu"><Icon name="dots" :size="14" /></Btn>
            </span>
        </footer>
        <template v-if="menu">
            <MenuPanel :anchor="more" align="end" :min-width="150" @click.stop @close="menu = false">
                <MenuItem class="danger" data-secret-delete @click="pick">Delete</MenuItem>
            </MenuPanel>
        </template>
    </article>
</template>

<style scoped>
.secret {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    min-width: 0;
    padding: 18px 18px 14px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
    background: var(--raised);
    transition: border-color 0.2s;
}

.secret:hover {
    border-color: var(--border-3);
}

.head {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mark {
    flex: none;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border-2);
    border-radius: 11px;
    background: var(--bg-2);
    color: var(--text-2);
}

.names {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.title {
    overflow: hidden;
    color: var(--text);
    font-size: 14.5px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.type {
    color: var(--text-3);
    font-size: 11.5px;
}

/* always two lines of room, cut at two, so a long note or none leaves the card the same height */
.note {
    display: -webkit-box;
    height: calc(2 * 1.5em);
    margin: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.meta {
    margin: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.acts {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--border);
}

.more {
    margin-left: auto;
    color: var(--text-2);
}

.danger {
    color: var(--danger);
}
</style>
