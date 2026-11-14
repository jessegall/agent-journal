<script setup>
import {Btn, TimeAgo} from "@journal/window-kit";

defineProps({sessions: {type: Array, required: true}});
defineEmits(["close"]);
</script>

<template>
    <div class="session-history" data-agent-session-history>
        <template v-if="!sessions.length"><p>This agent has no session in its history.</p></template>
        <ol>
            <template v-for="session in sessions" :key="session.session">
                <li data-agent-session>
                    <span>{{ [session.program, session.model].filter(Boolean).join(" ") }}</span>
                    <template v-if="session.started_at"><span>Started <TimeAgo :at="session.started_at" /></span></template>
                    <span data-agent-session-state>{{ session.end_reason ? `Ended: ${session.end_reason.replaceAll("_", " ")}` : session.started_at ? "Running" : "Not started" }}</span>
                    <code>{{ session.session }}</code>
                </li>
            </template>
        </ol>
        <div class="action-buttons"><Btn small @click="$emit('close')">Close</Btn></div>
    </div>
</template>

<style scoped>
.session-history { display: flex; flex-direction: column; gap: 6px; padding: 10px; border: 1px solid var(--border); border-radius: 7px; }
ol { display: flex; flex-direction: column; gap: 4px; margin: 0; padding: 0; list-style: none; }
li { display: flex; flex-wrap: wrap; gap: 4px 12px; color: var(--text-2); }
code { color: var(--text-3); font-size: 11px; }
p { margin: 0; color: var(--text-2); }
</style>
