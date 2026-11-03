<script setup>
import {computed, ref} from "vue";
import {RowList, useRows} from "@journal/window-kit";

const ALLOWED_MODELS = "journal.suites.coding.workers.allowed-models";

// each program's models, ticked when a worker may run on them; a program keeps at least one
const {rows, failure, loaded, load, context} = useRows("worker models", ["setting.*"]);
const refusal = ref("");
const isLast = (row) => row.allowed && rows.value.filter((other) => other.program === row.program && other.allowed).length === 1;
const programStart = computed(() => new Set(rows.value.filter((row, index) => rows.value[index - 1]?.program !== row.program).map((row) => row.id)));

async function toggle(row) {
    if (isLast(row)) return;
    const allowed = rows.value.filter((other) => (other.id === row.id ? !other.allowed : other.allowed)).map((other) => other.id);
    const answer = await context.run(["setting", "set", ALLOWED_MODELS, allowed.join(","), "--project"]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) load();
}
</script>

<template>
    <div class="worker-models">
        <p class="worker-models-note">Listed from the cheapest to the strongest. A worker runs on the general model when it is ticked, otherwise on the ticked model nearest to it.</p>
        <template v-if="refusal">
            <p class="worker-models-refusal" role="alert">{{ refusal }}</p>
        </template>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No agent programs" hint="An agent program a module offers shows here with its models.">
            <template #default="{row}">
                <div class="worker-model" :data-worker-model="row.id">
                    <span class="worker-model-program">{{ programStart.has(row.id) ? row.title : "" }}</span>
                    <label class="worker-model-name">
                        <input type="checkbox" :checked="row.allowed" :disabled="isLast(row)" :title="isLast(row) ? 'A program keeps at least one model' : ''" @change="toggle(row)" />
                        {{ row.model }}
                    </label>
                </div>
            </template>
        </RowList>
    </div>
</template>

<style scoped>
.worker-models {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.worker-models-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.worker-models-refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.worker-model {
    display: flex;
    flex: 1;
    gap: 14px;
    align-items: center;
    padding: 4px 0;
}

.worker-model-program {
    flex: 0 0 120px;
    color: var(--text-2);
    font-size: 12px;
    font-weight: 600;
}

.worker-model-name {
    display: flex;
    gap: 8px;
    align-items: center;
}
</style>
