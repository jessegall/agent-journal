<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import {age} from "../format/time.js";

defineProps({
    skill: {type: Object, required: true},
    depth: {type: Number, default: 0},
    busy: {type: String, default: ""},
    opened: {type: String, default: ""},
    text: {type: String, default: ""},
});
defineEmits(["open", "load", "always", "keywords"]);

function state(skill) {
    return skill.stale ? "Changed since loaded" : skill.loaded ? "Loaded" : "";
}
</script>

<template>
    <div :class="['row', {loaded: skill.loaded, stale: skill.stale, open: opened === skill.name}]" :style="{'--depth': depth}">
        <button type="button" class="main" @click="$emit('open', skill)">
            <Icon name="book" />
            <span class="name" :title="skill.name">{{ skill.name }}</span>
            <span class="description">{{ skill.description }}</span>
        </button>
        <span :class="['state', {stale: skill.stale}]">{{ state(skill) }}</span>
        <span class="changed" :title="`SKILL.md changed ${age(skill.changed)}`">{{ age(skill.changed) }}</span>
        <Btn
            small
            :disabled="busy === skill.name || (skill.loaded && !skill.stale)"
            :title="skill.loaded && !skill.stale ? 'Loaded, and unchanged since' : `Ask the agent to load ${skill.name} now`"
            @click="$emit('load', skill)"
        >
            Load
        </Btn>
        <Switch
            :on="skill.always"
            word="every start"
            :title="skill.always ? 'Stop naming it at every start' : 'Name it at every start'"
            @change="$emit('always', skill, $event)"
        />
    </div>
    <template v-if="opened === skill.name">
        <div class="keywords" :style="{'--depth': depth}">
            <label :for="`keywords-${skill.name}`">Load it when these words come up</label>
            <input
                :id="`keywords-${skill.name}`"
                class="keyword-input"
                :value="(skill.keywords || []).join(', ')"
                placeholder="dump, drop, paste"
                spellcheck="false"
                @change="$emit('keywords', skill, $event.target.value)"
            />
        </div>
        <pre class="text" :style="{'--depth': depth}">{{ text }}</pre>
    </template>
</template>

<style scoped>
.keywords {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: calc(var(--depth) * 18px);
    padding: 8px 10px;
    color: var(--text-3);
    font-size: 12px;
}

.keyword-input {
    flex: 1 1 auto;
    min-width: 0;
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
}

.keyword-input:focus {
    outline: none;
    border-color: var(--accent);
}

.row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 40px;
    padding: 4px 8px 4px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
}

.row.loaded {
    border-color: var(--border-2);
}

.main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 0 4px calc(var(--depth) * 18px);
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.main .ico {
    flex: none;
    width: 14px;
    height: 14px;
    opacity: 0.7;
}

.name {
    flex: none;
    max-width: 34ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}

.description {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: var(--text-3);
}

.state {
    flex: none;
    font-size: 11px;
    color: var(--progress);
}

.state.stale {
    color: var(--blocking);
}

.changed {
    flex: none;
    width: 3ch;
    font-size: 11px;
    color: var(--text-4);
}

.text {
    margin: 0 0 8px;
    padding: 14px 16px 14px calc(16px + var(--depth) * 18px);
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-wrap;
    color: var(--text-2);
}
</style>
