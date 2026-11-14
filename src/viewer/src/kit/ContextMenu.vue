<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {menuEntries} from "../composables/contextMenu.js";
import MenuItem from "./MenuItem.vue";
import MenuPanel from "./MenuPanel.vue";

// the journal's own menu for a right click: a heading, then the items in groups, at a spot on the screen. A page opens it through useContextMenu.
// item: {label, group (open, copy, own), keys, children: [item], danger, armedLabel, disabled, reason, run}; a disabled item stays, with its short reason at the right.
// A danger item asks once in place, its label turning into armedLabel ("Label: click again" by default), and runs on the second click.
const props = defineProps({
    at: {type: Object, required: true},
    head: {type: String, default: ""},
    items: {type: Array, required: true},
    // the element the menu belongs to; it wears an accent ring while the menu is open
    target: {type: Object, default: null},
    depth: {type: Number, default: 0},
});
// done: an item was chosen (the whole menu closes) or the menu was only dismissed
const emit = defineEmits(["close"]);
const entries = computed(() => menuEntries(props.items));
const sub = ref(null);
// the danger item that asked once and waits for its second click
const armed = ref("");
const MENU = ".context-menu";
const buttons = (panel) => [...panel.querySelectorAll("[data-menu-item]:not(:disabled)")];
const focusAt = (panel, pick) => pick(buttons(panel))?.focus();
const entryOf = (button) => entries.value.find((entry) => entry.key === button?.dataset.menuItem);

function choose(entry, button) {
    if (entry.disabled) return;
    if (entry.children) {
        const box = button.getBoundingClientRect();
        sub.value = {items: entry.children, at: {x: box.right + 2, y: box.top - 4, flipX: box.left - 2}, opener: button};
        return;
    }
    if (entry.danger && armed.value !== entry.key) {
        armed.value = entry.key;
        return;
    }
    emit("close", true);
    // runs once the menu is gone and the click that chose it is over, so the window it acts on updates as on a plain click
    if (entry.run) setTimeout(entry.run, 0);
}

function hover(entry, button) {
    button.focus();
    if (entry.children && !entry.disabled) return choose(entry, button);
    sub.value = null;
}

function letter(panel, key) {
    const all = buttons(panel);
    const after = all.slice(all.indexOf(document.activeElement) + 1).concat(all);
    after.find((button) => entryOf(button).label.toLowerCase().startsWith(key.toLowerCase()))?.focus();
}

const KEYS = {
    Home: (panel) => focusAt(panel, (all) => all[0]),
    End: (panel) => focusAt(panel, (all) => all[all.length - 1]),
    Enter: () => document.activeElement.click(),
    " ": () => document.activeElement.click(),
    ArrowRight: (panel) => entryOf(document.activeElement)?.children && document.activeElement.click(),
    ArrowLeft: () => props.depth && emit("close", false),
    Tab: () => emit("close", false),
};

function onKey(event) {
    const panel = event.currentTarget;
    const inside = panel.contains(document.activeElement) && document.activeElement.dataset.menuItem !== undefined;
    if (KEYS[event.key] && (inside || !["Enter", " ", "ArrowRight"].includes(event.key))) {
        event.preventDefault();
        KEYS[event.key](panel);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) letter(panel, event.key);
}

function dismiss(event) {
    if (!event.target.closest?.(MENU)) emit("close", false);
}

const close = () => emit("close", false);
const subClosed = (done) => {
    const opener = sub.value.opener;
    sub.value = null;
    if (done) emit("close", true);
    else opener.focus();
};

onMounted(() => {
    props.target?.classList.add("menu-target");
    if (props.depth) return;
    window.addEventListener("pointerdown", dismiss, true);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("blur", close);
    window.addEventListener("resize", close);
});
onUnmounted(() => {
    props.target?.classList.remove("menu-target");
    window.removeEventListener("pointerdown", dismiss, true);
    window.removeEventListener("scroll", dismiss, true);
    window.removeEventListener("blur", close);
    window.removeEventListener("resize", close);
});
</script>

<template>
    <MenuPanel class="context-menu" role="menu" data-context-menu :point="at" :gap="0" :min-width="196" :max-width="320" :aria-label="head" @close="emit('close', false)" @keydown="onKey" @contextmenu.prevent>
        <template v-if="head && !depth">
          <p class="context-head" data-context-head>{{ head }}</p>
        </template>
        <template v-for="entry in entries" :key="entry.key">
            <template v-if="entry.separator">
              <hr class="context-separator" role="separator" data-context-separator />
            </template>
            <template v-else>
              <MenuItem role="menuitem" :class="{'context-danger': entry.danger, 'context-armed': armed === entry.key}" :disabled="entry.disabled" :aria-haspopup="entry.children ? 'menu' : undefined" :title="entry.disabled ? entry.reason : undefined" :data-menu-item="entry.key" @click="choose(entry, $event.currentTarget)" @mouseenter="hover(entry, $event.currentTarget)">
                  <span class="context-label">{{ armed === entry.key ? entry.armedLabel ?? `${entry.label}: click again` : entry.label }}</span>
                  <template v-if="entry.disabled">
                    <span class="context-note" data-context-reason>{{ entry.reason }}</span>
                  </template>
                  <template v-else-if="entry.children">
                    <span class="context-note" aria-hidden="true">›</span>
                  </template>
                  <template v-else-if="entry.keys">
                    <kbd class="context-note">{{ entry.keys }}</kbd>
                  </template>
              </MenuItem>
            </template>
        </template>
        <template v-if="sub">
          <ContextMenu :depth="depth + 1" :at="sub.at" :items="sub.items" @close="subClosed" />
        </template>
    </MenuPanel>
</template>

<style scoped>
.context-head {
    margin: 0;
    padding: 4px 8px 6px;
    overflow: hidden;
    color: var(--text-4);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.context-separator {
    width: 100%;
    margin: 4px 0;
    border: 0;
    border-top: 1px solid var(--border);
}

.context-label {
    flex: 1;
}

.context-note {
    color: var(--text-4);
    font: inherit;
    font-size: 11px;
}

.context-danger,
.context-danger:hover:enabled {
    color: var(--danger);
}

.context-armed {
    background: color-mix(in srgb, var(--danger) 16%, transparent);
}

:global(.menu-target) {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
}
</style>
