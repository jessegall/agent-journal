<script setup>
import {computed} from "vue";
import {Btn} from "@journal/window-kit";

// whether the main agent has read the skill in this conversation, and the button that makes it read the skill now or again
const props = defineProps({skill: {type: Object, required: true}, agent: {type: Number, default: null}});
const emit = defineEmits(["read"]);
const status = computed(() => {
    if (!props.agent) return "No main agent is running in this environment.";
    if (props.skill.changed) return "This skill changed after the main agent read it.";
    if (props.skill.held?.state === "due") return "The main agent still has to read this skill. It cannot do anything else first.";
    if (props.skill.read) return `The main agent read this skill at ${new Date(props.skill.held.loaded_at).toLocaleString()}.`;
    return "The main agent has not read this skill in this conversation.";
});
</script>

<template>
    <div class="read-by" data-skill-read-by>
        <p class="status" data-skill-status>{{ status }}</p>
        <template v-if="agent && skill.held?.state !== 'due'">
            <Btn small data-skill-read-now @click="emit('read')">{{ skill.read ? "Make the agent read it again" : "Make the agent read it now" }}</Btn>
        </template>
    </div>
</template>

<style scoped>
.read-by { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding-top: 16px; }
.status { margin: 0; color: var(--text-2); font-size: 12.5px; line-height: 1.6; }
</style>
