<script setup>
import CloseButton from "../kit/CloseButton.vue";
import Btn from "../kit/Btn.vue";
import Skeleton from "../kit/Skeleton.vue";
import {peek} from "../route.js";

const props = defineProps({title: {type: String, required: true}, entries: {type: Array, default: () => []}, counts: {type: String, default: ""}, none: {type: String, default: ""}, table: {type: String, default: ""}, loading: Boolean});
const emit = defineEmits(["close"]);

function inspect(entry) {
    if (!props.table || !entry.id) return;
    peek(props.table, entry.id);
    emit("close");
}
</script>

<template>
    <div class="agents">
        <header class="agents-head">
            <div>
                <h4 class="agents-heading">{{ title }}</h4>
                <span class="agents-counts">{{ counts }}</span>
            </div>
            <span class="agents-actions">
                <slot name="actions" />
                <CloseButton @click="emit('close')" />
            </span>
        </header>
        <slot />
        <div class="agents-body">
            <template v-if="!entries.length && loading">
                <Skeleton :count="2" :label="`Loading the ${title.toLowerCase()}`" />
            </template>
            <template v-else-if="!entries.length">
                <p class="agents-none">{{ none }}</p>
            </template>
            <template v-for="entry in entries" :key="entry.key ?? entry.id">
                <component :is="table ? Btn : 'div'" v-bind="table ? {kind: 'text'} : {}" :class="['agent', entry.tone]" @click="inspect(entry)">
                    <span :class="['agent-dot', entry.tone]" />
                    <span class="agent-what">
                        <strong class="agent-name">{{ entry.name }}</strong>
                        <span class="agent-state">{{ entry.state }}</span>
                        <small v-if="entry.active" class="agent-active">{{ entry.active }}</small>
                        <small v-if="entry.work" class="agent-work" :title="entry.work">{{ entry.work }}</small>
                    </span>
                </component>
            </template>
        </div>
    </div>
</template>

<style scoped>
.agents {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.agents-head {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 2px 2px 8px 8px;
    border-bottom: 1px solid var(--line);
}

.agents-heading {
    margin: 0;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.agents-counts {
    margin-left: 8px;
    color: var(--text-3);
    font-size: 12px;
}

.agents-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-top: 4px;
}

.agent {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    padding: 6px 8px;
    text-align: left;
}

.agent.ended {
    opacity: 0.7;
}

.agent-dot {
    flex: none;
    width: 7px;
    height: 7px;
    margin-top: 6px;
    border-radius: 50%;
    background: var(--text-3);
}

.agent-dot.active {
    background: var(--accent);
}

.agent-dot.idle {
    background: var(--tone-work);
}

.agent-what {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
}

.agent-name {
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.agent-state {
    color: var(--text-2);
    font-size: 12px;
}

.agent-active {
    color: var(--text-3);
    font-size: 11px;
}

.agent-work {
    overflow: hidden;
    color: var(--text-3);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.agents-none {
    margin: 8px;
    color: var(--text-3);
    font-size: 12px;
}

.agents-actions {
    display: flex;
    align-items: center;
    gap: 2px;
}
</style>
