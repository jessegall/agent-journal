<script setup>
import {computed, ref} from "vue";
import {Btn} from "@journal/window-kit";
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

async function saveValue(text) {
    const result = await props.save(["setting", "set", props.row.key, String(text), ...scopeFlag.value]);
    refusal.value = result.ok ? "" : result.error;
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
                    <button type="button" class="setting-switch" role="switch" :aria-checked="row.value !== false" data-group-switch @click="switchGroup">
                        {{ row.value === false ? "Off" : "On" }}
                    </button>
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
            <label class="setting-label" :for="row.key">{{ row.title }}</label>
            <p class="setting-description">{{ row.description }}</p>
            <template v-if="row.secret">
                <p class="setting-shown">{{ row.shown }}</p>
                <input :id="row.key" v-model="typed" class="setting-field" type="password" :disabled="readOnly" placeholder="Type a new value" @change="savedSecret" />
            </template>
            <template v-else-if="row.type === 'flag'">
                <button type="button" class="setting-switch" role="switch" :aria-checked="row.value === true" :disabled="readOnly" @click="saveValue(row.value === true ? 'off' : 'on')">
                    {{ row.value === true ? "On" : "Off" }}
                </button>
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
    border: 1px solid var(--line);
    border-radius: 10px;
    color: var(--text-2);
    background: transparent;
    font-size: 11px;
}

.setting-switch[aria-checked="true"] {
    color: var(--text);
    border-color: var(--accent);
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
