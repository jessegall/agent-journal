<script setup>
import {ref} from "vue";
import Icon from "./Icon.vue";
import InlineName from "./InlineName.vue";
import LayoutThumb from "./LayoutThumb.vue";
import MenuItem from "./MenuItem.vue";

defineProps({presets: {type: Array, required: true}, savable: Boolean});
const emit = defineEmits(["pick", "save", "rename", "remove", "update", "share", "import"]);
const editing = ref("");
const naming = ref(false);
const flashed = ref("");
const FLASH = 1600;
let flashing = 0;

function flash(key) {
    flashed.value = key;
    clearTimeout(flashing);
    flashing = setTimeout(() => (flashed.value = ""), FLASH);
}

const picker = ref(null);
const unreadable = ref(false);

function updated(key) {
    emit("update", key);
    flash(key);
}

function shared(key) {
    emit("share", key);
    flash(`share:${key}`);
}

async function imported(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
        const preset = JSON.parse(await file.text());
        if (typeof preset.name !== "string" || typeof preset.shape !== "object") throw new Error("not a layout");
        unreadable.value = false;
        emit("import", preset);
        flash("import");
    } catch (error) {
        unreadable.value = true;
    }
}

function renamed(key, name) {
    editing.value = "";
    emit("rename", key, name);
}

function saved(name) {
    naming.value = false;
    emit("save", name);
    flash("new");
}
</script>

<template>
    <template v-for="p in presets" :key="p.key">
        <div class="preset-row">
            <template v-if="editing === p.key">
                <div class="preset preset-edit">
                    <LayoutThumb :cells="p.cells" />
                    <InlineName :value="p.name" @done="(name) => renamed(p.key, name)" @cancel="editing = ''" />
                </div>
            </template>
            <template v-else>
                <MenuItem
                    class="preset"
                    :on="p.current"
                    :aria-current="p.current"
                    :title="`${p.name}: ${p.text}`"
                    @click="emit('pick', p.key)"
                >
                    <LayoutThumb :cells="p.cells" />
                    <span class="preset-body">
                        <span class="preset-name">{{ p.name }}</span>
                        <span class="preset-text">{{ p.text }}</span>
                    </span>
                </MenuItem>
                <template v-if="p.saved">
                    <span class="preset-tools">
                        <button
                            type="button"
                            :class="['preset-tool', {done: flashed === p.key}]"
                            :title="flashed === p.key ? 'Saved' : 'Save the current layout into it'"
                            @click.stop="updated(p.key)"
                        >
                            <Icon :name="flashed === p.key ? 'tick' : 'saveinto'" :size="12" />
                        </button>
                        <button
                            type="button"
                            :class="['preset-tool', {done: flashed === `share:${p.key}`}]"
                            :title="flashed === `share:${p.key}` ? 'Downloaded' : 'Download it as a file to share'"
                            @click.stop="shared(p.key)"
                        >
                            <Icon :name="flashed === `share:${p.key}` ? 'tick' : 'download'" :size="12" />
                        </button>
                        <button type="button" class="preset-tool" title="Rename" @click.stop="editing = p.key">
                            <Icon name="pencil" :size="12" />
                        </button>
                        <button type="button" class="preset-tool" title="Delete" @click.stop="emit('remove', p.key)">
                            <Icon name="x" :size="12" />
                        </button>
                    </span>
                </template>
            </template>
        </div>
    </template>
    <template v-if="savable">
        <template v-if="naming">
            <div class="preset-save">
                <Icon name="plus" :size="14" />
                <InlineName placeholder="A name for this layout" @done="saved" @cancel="naming = false" />
            </div>
        </template>
        <template v-else>
            <MenuItem :class="{done: flashed === 'new'}" @click="naming = true">
                <Icon :name="flashed === 'new' ? 'tick' : 'plus'" :size="14" />
                {{ flashed === "new" ? "Saved" : "Save layout" }}
            </MenuItem>
        </template>
        <input ref="picker" class="preset-picker" type="file" accept=".json,application/json" @change="imported" />
        <MenuItem :class="{done: flashed === 'import'}" @click="picker.click()">
            <Icon :name="flashed === 'import' ? 'tick' : 'share'" :size="14" />
            {{ flashed === "import" ? "Imported" : "Import a layout" }}
        </MenuItem>
        <template v-if="unreadable">
            <p class="preset-unreadable">That file isn't a saved layout. Download one with a layout's download button.</p>
        </template>
    </template>
</template>

<style scoped>
.preset-row {
    position: relative;
    display: flex;
}

.preset {
    flex: 1;
    gap: 11px;
    padding: 6px 8px;
}

.preset.on {
    background: var(--sel);
}

.preset.on .layout-thumb {
    border-color: var(--text-4);
}

.preset-edit {
    display: flex;
    align-items: center;
}

.preset-body {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
}

.preset-name {
    color: var(--text);
    font-size: 12.5px;
}

.preset-name,
.preset-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.preset-text {
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.35;
}

.preset-tools {
    position: absolute;
    top: 50%;
    right: 6px;
    display: flex;
    gap: 2px;
    opacity: 0;
    transform: translateY(-50%);
    transition: opacity 0.15s;
}

.preset-row:hover .preset-tools,
.preset-tools:focus-within {
    opacity: 1;
}

.preset-tool {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border: 0;
    border-radius: 5px;
    background: var(--raised);
    color: var(--text-3);
    cursor: pointer;
}

.preset-tool:hover {
    background: var(--hover);
    color: var(--text);
}

.preset-save {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    color: var(--text-3);
}

.preset-picker {
    display: none;
}

.preset-unreadable {
    margin: 2px 8px 6px 30px;
    color: var(--tone-warn);
    font-size: 12px;
}

.preset-tool.done,
.menu-item.done {
    color: var(--tone-good);
}
</style>
