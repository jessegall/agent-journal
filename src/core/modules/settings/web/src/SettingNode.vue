<script setup>
import {computed, ref} from "vue";
import {Btn, Switch} from "@journal/window-kit";
import {itemsOfLines, listLines, sentList, shownList} from "@journal/setting-components";
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
const CHANGED_SOURCES = new Set(["environment", "project"]);
const UNITS = {seconds: "seconds", minutes: "minutes", hours: "hours", days: "days", bytes: "bytes", characters: "characters", percent: "%"};
// a quantity's key names its unit, so the field can say it
const unit = computed(() => (props.row.type === "number" ? UNITS[props.row.key.split(/[-_.]/).at(-1)] ?? "" : ""));
const isList = computed(() => props.row.type === "list" || props.row.type === "number list");
const listText = computed(() => listLines(props.row.value));
const isChanged = computed(() => CHANGED_SOURCES.has(props.row.source));
const resettable = computed(() => !props.readOnly && !props.row.secret && !isGroup.value && isChanged.value && props.row.default !== null && props.row.default !== undefined);
const defaultWords = computed(() => (typeof props.row.default === "boolean" ? (props.row.default ? "on" : "off") : Array.isArray(props.row.default) ? props.row.default.join(",") : String(props.row.default)));

// what the row shows once the text is saved: a value in the form the server lists it in; a secret shows none, and a list is kept as a JSON list
function shownAs(text) {
    if (props.row.type === "flag") return text === "on";
    if (props.row.type === "number") return Number.isNaN(Number(text)) ? text : Number(text);
    if (isList.value) return shownList(text, props.row.type === "number list");
    return text;
}

// the row shows the new value at once, and the refusal says why it went back
async function saveValue(text) {
    const line = ["setting", "set", props.row.key, String(text), ...scopeFlag.value];
    const result = await props.save(line, props.row.secret ? null : {key: props.row.key, value: shownAs(String(text))});
    if (result.ok) refusal.value = "";
    else refusal.value = result.error;
}

async function switchGroup() {
    const result = await props.save(["setting", "switch", props.row.key, props.row.value === false ? "on" : "off", "--project"], {key: props.row.key, value: props.row.value === false});
    refusal.value = result.ok ? "" : result.error;
}

function changed(event) {
    saveValue(event.target.value);
}

function listChanged(event) {
    saveValue(sentList(itemsOfLines(event.target.value), props.row.type === "number list"));
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
                <label class="setting-label" :for="row.key">{{ row.title }}</label>
                <template v-if="isChanged">
                    <span class="setting-dot" data-setting-changed title="Changed from the default" />
                </template>
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
                        <Btn small :variant="choice === row.value ? 'primary' : 'ghost'" :data-choice="choice" :disabled="readOnly" @click="saveValue(choice)">{{ choice }}</Btn>
                    </template>
                </div>
            </template>
            <template v-else-if="isList">
                <textarea :id="row.key" class="setting-field setting-list" rows="3" :value="listText" :disabled="readOnly" placeholder="One on each line" data-setting-list @change="listChanged" />
            </template>
            <template v-else>
                <div class="setting-input">
                    <input
                        :id="row.key"
                        class="setting-field"
                        :type="row.type === 'number' ? 'number' : 'text'"
                        :value="row.value"
                        :disabled="readOnly"
                        @change="changed"
                    />
                    <template v-if="unit">
                        <span class="setting-unit" data-setting-unit>{{ unit }}</span>
                    </template>
                </div>
            </template>
            <template v-if="refusal">
                <p class="setting-refusal">{{ refusal }}</p>
            </template>
        </div>
    </template>
</template>

<style scoped>
.setting-input {
    display: flex;
    gap: 8px;
    align-items: center;
}

.setting-unit {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.setting-list {
    resize: vertical;
}

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
