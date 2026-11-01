<script setup>
import {computed, ref} from "vue";
import {Btn, Switch} from "@journal/window-kit";
import SettingNode from "./SettingNode.vue";

// one setting or group: a group draws its title, its switch when it can be switched off, and each child as a node
// of its own; a value draws its label above a field of its type
const props = defineProps({
    row: {type: Object, required: true},
    rows: {type: Array, required: true},
    readOnly: {type: Boolean, required: true},
    save: {type: Function, required: true},
});

const children = computed(() => props.rows.filter((row) => row.parent === props.row.key));
const isGroup = computed(() => props.row.type === "group");
const scopeFlag = computed(() => (props.row.scope === "project" ? ["--project"] : []));
const refusal = ref("");
const typed = ref("");
const DEFAULT_SOURCE = "default";
const resettable = computed(() => !props.readOnly && !props.row.secret && !isGroup.value && props.row.source !== DEFAULT_SOURCE && props.row.default !== null && props.row.default !== undefined);
const defaultWords = computed(() => (typeof props.row.default === "boolean" ? (props.row.default ? "on" : "off") : Array.isArray(props.row.default) ? props.row.default.join(",") : String(props.row.default)));

async function saveValue(text) {
    const line = ["setting", "set", props.row.key, String(text), ...scopeFlag.value];
    const result = await props.save(line);
    if (result.ok) refusal.value = "";
    else refusal.value = result.error;
}

async function switchGroup() {
    const result = await props.save(["setting", "switch", props.row.key, props.row.value === false ? "on" : "off", "--project"]);
    refusal.value = result.ok ? "" : result.error;
}

function changed(event) {
    saveValue(event.target.value);
}

function savedSecret() {
    if (!typed.value) return;
    saveValue(typed.value).then(() => (typed.value = ""));
}
</script>

<template>
    <template v-if="isGroup">
        <section class="setting-group" :data-setting="row.key">
            <div class="setting-group-head">
                <h3 class="setting-group-title">{{ row.title }}</h3>
                <template v-if="row.toggleable && !readOnly">
                    <Switch :on="row.value !== false" :title="`Switch ${row.title} ${row.value === false ? 'on' : 'off'}`" data-group-switch @change="switchGroup" />
                </template>
            </div>
            <p class="setting-description">{{ row.description }}</p>
            <div :class="['setting-children', {off: row.value === false}]">
                <template v-for="child in children" :key="child.key">
                    <SettingNode :row="child" :rows="rows" :read-only="readOnly" :save="save" />
                </template>
            </div>
            <template v-if="refusal">
                <p class="setting-refusal">{{ refusal }}</p>
            </template>
        </section>
    </template>
    <template v-else>
        <div class="setting-value" :data-setting="row.key">
            <div class="setting-head">
                <template v-if="row.source !== DEFAULT_SOURCE">
                    <span class="setting-dot" data-setting-changed title="Changed from the default" />
                </template>
                <label class="setting-label" :for="row.key">{{ row.title }}</label>
                <template v-if="resettable">
                    <button type="button" class="setting-reset" data-setting-reset :title="`Back to the default: ${defaultWords}`" @click="saveValue(defaultWords)">Reset</button>
                </template>
            </div>
            <p class="setting-description">{{ row.description }}</p>
            <template v-if="row.secret">
                <p class="setting-shown">{{ row.shown }}</p>
                <input :id="row.key" v-model="typed" class="setting-field" type="password" :disabled="readOnly" placeholder="Type a new value" @change="savedSecret" />
            </template>
            <template v-else-if="row.type === 'flag'">
                <Switch :on="row.value === true" :title="row.title" :disabled="readOnly" data-flag-switch @change="(on) => !readOnly && saveValue(on ? 'on' : 'off')" />
            </template>
            <template v-else-if="row.type === 'choice'">
                <div class="setting-choices">
                    <template v-for="choice in row.choices" :key="choice">
                        <Btn small :kind="choice === row.value ? 'primary' : 'ghost'" :data-choice="choice" :disabled="readOnly" @click="saveValue(choice)">{{ choice }}</Btn>
                    </template>
                </div>
            </template>
            <template v-else>
                <input
                    :id="row.key"
                    class="setting-field"
                    :type="row.type === 'number' ? 'number' : 'text'"
                    :value="row.type === 'list' || row.type === 'number list' ? row.shown : row.value"
                    :disabled="readOnly"
                    @change="changed"
                />
            </template>
            <template v-if="refusal">
                <p class="setting-refusal">{{ refusal }}</p>
            </template>
        </div>
    </template>
</template>

<style scoped>
.setting-head {
    display: flex;
    gap: 6px;
    align-items: center;
}

.setting-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.setting-reset {
    margin-left: auto;
    padding: 0 6px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.setting-reset:hover {
    background: var(--hover);
    color: var(--text);
}

.setting-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.setting-group-head {
    display: flex;
    align-items: center;
    gap: 10px;
}

.setting-group-title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
}

.setting-children {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-left: 14px;
    border-left: 1px solid var(--line);
}

.setting-children.off {
    opacity: 0.5;
}

.setting-value {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.setting-label {
    font-size: 12px;
    color: var(--text);
}

.setting-description,
.setting-shown {
    margin: 0;
    font-size: 12px;
    color: var(--text-3);
}

.setting-field {
    max-width: 360px;
    padding: 6px 10px;
    border: 1px solid var(--line);
    border-radius: 6px;
    color: var(--text);
    background: transparent;
}

.setting-switch {
    align-self: flex-start;
    padding: 2px 10px;
    border: 0;
    border-radius: 10px;
    color: var(--text-2);
    background: var(--raised);
    font-size: 11px;
    cursor: pointer;
}

.setting-switch[aria-checked="true"] {
    color: #fff;
    background: var(--accent);
}

.setting-choices {
    display: flex;
    gap: 6px;
}

.setting-refusal {
    margin: 0;
    font-size: 12px;
    color: var(--danger);
}
</style>
