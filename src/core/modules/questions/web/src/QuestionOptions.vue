<script setup>
import {computed, ref} from "vue";
import {Btn, InspectorPart, useWindow} from "@journal/window-kit";

// one button for each answer the agent offered, the recommended one first and primary; pressing one answers the question with it
const view = useWindow();
const row = view.option("row");
const options = computed(() => (row.value.state === "open" ? row.value.options ?? [] : []));
const recommended = computed(() => row.value.recommended);
const refusal = ref("");

async function pick(option) {
    const answer = await view.run(["question", "answer", String(row.value.id), "--answer", option]);
    refusal.value = answer.ok ? "" : answer.error;
}
</script>

<template>
    <template v-if="options.length">
        <InspectorPart title="Answers offered">
            <div class="options" data-question-options>
                <template v-for="option in options" :key="option">
                    <Btn small :variant="option === recommended ? 'primary' : 'ghost'" :bordered="option !== recommended" data-question-option @click="pick(option)">
                        {{ option === recommended ? `${option} (recommended)` : option }}
                    </Btn>
                </template>
            </div>
            <template v-if="refusal">
                <p class="refusal" role="alert">{{ refusal }}</p>
            </template>
        </InspectorPart>
    </template>
</template>

<style scoped>
.options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.refusal {
    margin: 6px 0 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
