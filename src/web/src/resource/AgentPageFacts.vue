<script setup>
import Icon from "../kit/Icon.vue";
import {span} from "../format/time.js";

defineProps({data: {type: Object, required: true}});
</script>

<template>
    <div class="facts">
        <template v-if="data.branch">
            <span class="fact">
                <Icon name="branch" />
                {{ data.branch }}
            </span>
        </template>
        <span class="fact">
            <Icon name="reminders" />
            {{ data.started ? `up ${span(Date.now() / 1000 - data.started)}` : "just started" }}
        </span>
        <span class="fact">
            <Icon name="activity" />
            context {{ Math.round(Number(data.context || 0)) }}%
        </span>
        <span class="fact">
            <Icon name="terminal" />
            {{ data.shells || 0 }} shells
        </span>
        <span class="fact">
            <Icon name="agents" />
            {{ data.subagents || 0 }} subagents
        </span>
        <span class="fact">
            <Icon name="book" />
            {{ (data.skills || []).length }} skills
        </span>
    </div>
</template>

<style scoped>
.facts {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 12px;
    color: var(--text-2);
}

.fact {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.fact .ico {
    width: 12px;
    height: 12px;
    opacity: 0.65;
}
</style>
