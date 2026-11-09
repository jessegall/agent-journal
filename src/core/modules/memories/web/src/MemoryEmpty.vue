<script setup>
import {Btn, SwitchCase} from "@journal/window-kit";

// what an empty list of memories says, and what to do about it: `kind` is justification it is empty
defineProps({kind: {type: String, required: true}, others: {type: Number, default: 0}, reason: {type: String, default: ""}});
const emit = defineEmits(["retry", "everyone", "others", "make"]);
</script>

<template>
    <div class="empty" data-memory-empty :data-kind="kind">
        <SwitchCase :value="kind">
            <template #failure>
                <b>The memories could not be read</b>
                <p data-memory-failure>{{ reason || "The journal did not answer." }} Nothing has been lost.</p>
                <Btn small bordered data-memory-retry @click="emit('retry')">Try again</Btn>
            </template>
            <template #search>
                <b>No memory here matches</b>
                <p>Try other words, or look in every agent's memories.</p>
                <Btn small bordered data-memory-everyone @click="emit('everyone')">Search every agent</Btn>
            </template>
            <template #removed>
                <b>No removed memories here</b>
                <p>A memory that is removed or fades to weight 0 shows here.</p>
            </template>
            <template #main-others>
                <b>The main agent has no memories yet</b>
                <p>Your other agents have {{ others }} active {{ others === 1 ? "memory" : "memories" }}.</p>
                <Btn small bordered data-memory-others @click="emit('others')">Read those</Btn>
            </template>
            <template #main>
                <b>No memories yet</b>
                <p>Memories you or the agent save appear here.</p>
                <Btn small bordered @click="emit('make')">New memory</Btn>
            </template>
            <template #agent>
                <b>This agent has no active memories</b>
                <p>Choose Removed or All from the menu in the search box to see the others.</p>
            </template>
        </SwitchCase>
    </div>
</template>

<style scoped>
.empty {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
    padding: 26px 0;
    color: var(--text-3);
}

.empty b {
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.empty p {
    max-width: 380px;
    margin: 0;
}
</style>
