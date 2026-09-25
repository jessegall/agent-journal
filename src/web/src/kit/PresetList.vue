<script setup>
import {nextTick, ref} from "vue";
import Btn from "./Btn.vue";
import Icon from "./Icon.vue";
import Segmented from "./Segmented.vue";
import TextInput from "./TextInput.vue";
import InlineName from "./InlineName.vue";
import LayoutThumb from "./LayoutThumb.vue";
import MenuItem from "./MenuItem.vue";

const props = defineProps({
    presets: {type: Array, required: true},
    savable: Boolean,
    linkFor: {type: Function, default: null},
    readLink: {type: Function, default: null},
});
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
const unreadable = ref("");
const NOT_A_LAYOUT = "That isn't a saved layout. Share one with a layout's share button.";
const LASTS = [
    {key: "1h", label: "1 hour"},
    {key: "1d", label: "1 day"},
    {key: "7d", label: "7 days"},
    {key: "once", label: "Once"},
];
const sharing = ref("");
const lasting = ref("1d");
const linking = ref(false);
const copied = ref(null);
const linkError = ref("");
const pasted = ref("");
const reading = ref(false);
const said = ref(null);
const showSaid = () => nextTick(() => said.value && said.value.scrollIntoView({block: "nearest"}));

function openShare(key) {
    if (!props.linkFor) return shared(key);
    sharing.value = sharing.value === key ? "" : key;
    copied.value = null;
    linkError.value = "";
}

async function copyLink(key) {
    linking.value = true;
    linkError.value = "";
    try {
        const once = lasting.value === "once";
        const url = await props.linkFor(key, once ? {expires: "7d", once} : {expires: lasting.value, once});
        await navigator.clipboard.writeText(url).catch(() => {});
        const label = LASTS.find((l) => l.key === lasting.value).label;
        copied.value = {key, url, note: once ? "It opens once, then stops working." : `It works for ${label}.`};
    } catch (error) {
        linkError.value = error.message;
    } finally {
        linking.value = false;
    }
}

function accept(preset) {
    if (typeof preset.name !== "string" || typeof preset.shape !== "object") throw new Error(NOT_A_LAYOUT);
    unreadable.value = "";
    emit("import", preset);
    flash("import");
}

async function importLink() {
    const url = pasted.value.trim();
    if (!url) return;
    reading.value = true;
    try {
        accept(await props.readLink(url));
        pasted.value = "";
    } catch (error) {
        unreadable.value = error instanceof SyntaxError ? NOT_A_LAYOUT : error.message;
        showSaid();
    } finally {
        reading.value = false;
    }
}

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
        accept(JSON.parse(await file.text()));
    } catch (error) {
        unreadable.value = NOT_A_LAYOUT;
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
                            <Icon :name="flashed === p.key ? 'tick' : 'floppy'" :size="12" />
                        </button>
                        <button
                            type="button"
                            :class="['preset-tool', {done: flashed === `share:${p.key}`, on: sharing === p.key}]"
                            :title="linkFor ? 'Share it as a file or a link' : 'Download it as a file to share'"
                            @click.stop="openShare(p.key)"
                        >
                            <Icon :name="flashed === `share:${p.key}` ? 'tick' : linkFor ? 'share' : 'download'" :size="12" />
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
        <template v-if="sharing === p.key">
            <div class="preset-share" @click.stop>
                <MenuItem :class="{done: flashed === `share:${p.key}`}" @click="shared(p.key)">
                    <Icon :name="flashed === `share:${p.key}` ? 'tick' : 'download'" :size="14" />
                    {{ flashed === `share:${p.key}` ? "Downloaded" : "Download file" }}
                </MenuItem>
                <div class="preset-link">
                    <span class="preset-link-label">Or copy a link that works for</span>
                    <Segmented :options="LASTS" :value="lasting" @pick="(key) => (lasting = key)" />
                    <Btn small kind="primary" :busy="linking" @click="copyLink(p.key)">
                        <Icon name="copy" :size="12" />
                        Copy link
                    </Btn>
                </div>
                <template v-if="copied && copied.key === p.key">
                    <p class="preset-link-done">Copied. {{ copied.note }}</p>
                    <code class="preset-link-url">{{ copied.url }}</code>
                </template>
                <template v-if="linkError">
                    <p class="preset-unreadable">{{ linkError }}</p>
                </template>
            </div>
        </template>
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
        <template v-if="readLink">
            <div class="preset-paste" @click.stop>
                <TextInput
                    :value="pasted"
                    placeholder="Or paste a layout link"
                    aria-label="A layout link to import"
                    @input="pasted = $event.target.value"
                    @keydown.enter.stop="importLink"
                />
                <Btn small :busy="reading" :disabled="!pasted.trim()" @click="importLink">Import</Btn>
            </div>
        </template>
        <template v-if="unreadable">
            <p ref="said" class="preset-unreadable">{{ unreadable }}</p>
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
.preset-tools:focus-within,
.preset-tools:has(.on) {
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

.preset-tool.on {
    background: var(--hover);
    color: var(--accent-text);
}

.preset-share {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 2px 4px 8px;
    padding: 6px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--bg-2);
}

.preset-link {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 8px;
    padding: 2px 4px 4px;
}

.preset-link-label {
    width: 100%;
    color: var(--text-3);
    font-size: 11.5px;
}

.preset-link-done {
    margin: 0 4px;
    color: var(--tone-good);
    font-size: 12px;
}

.preset-link-url {
    margin: 0 4px 2px;
    overflow-wrap: anywhere;
    color: var(--text-2);
    font-family: var(--mono);
    font-size: 11px;
    user-select: all;
}

.preset-paste {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px 6px;
}

.preset-paste > :first-child {
    flex: 1;
    min-width: 0;
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
