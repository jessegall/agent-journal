<script setup>
import {ref} from "vue";
import Icon from "./Icon.vue";
import InlineName from "./InlineName.vue";
import LayoutThumb from "./LayoutThumb.vue";
import MenuItem from "./MenuItem.vue";

defineProps({presets: {type: Array, required: true}, savable: Boolean});
const emit = defineEmits(["pick", "save", "rename", "remove", "update"]);
const editing = ref("");
const naming = ref(false);

function renamed(key, name) {
    editing.value = "";
    emit("rename", key, name);
}

function saved(name) {
    naming.value = false;
    emit("save", name);
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
                            class="preset-tool"
                            title="Update it with the current layout"
                            @click.stop="emit('update', p.key)"
                        >
                            <Icon name="restore" :size="12" />
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
            <MenuItem @click="naming = true">
                <Icon name="plus" :size="14" />
                Save layout
            </MenuItem>
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
</style>
