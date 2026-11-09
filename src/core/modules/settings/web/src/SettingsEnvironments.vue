<script setup>
import {computed, ref} from "vue";
import {Btn, RowList, removed, useWindow} from "@journal/window-kit";

// the environments of this project, the one you are in first; removing one asks first, shows it gone at once, and says why when it is refused
const context = useWindow();
const {rows, failure, loaded, act} = context.props.environments;
const asking = ref(0);
const refusal = ref({});
const here = (row) => row.name === context.environment;
const ordered = computed(() => [...rows.value].sort((a, b) => here(b) - here(a) || a.name.localeCompare(b.name)));

async function remove(row) {
    if (asking.value !== row.id) return void (asking.value = row.id);
    asking.value = 0;
    const answer = await act(["environment", "delete", String(row.id)], removed(row.id));
    refusal.value = {...refusal.value, [row.id]: answer.ok ? "" : answer.error};
}
</script>

<template>
    <RowList :rows="ordered" :failure="failure" :loaded="loaded" empty="No environments yet" hint="An environment is one line of work in this project; make one to start.">
        <template #default="{row}">
            <div class="environment" :data-environment="row.name">
                <div class="environment-names">
                    <span class="environment-name">{{ row.name }}</span>
                    <template v-if="here(row)">
                        <span class="environment-here">You are here</span>
                    </template>
                    <p class="environment-folder">{{ row.folder }}{{ row.branch ? ` on ${row.branch}` : "" }}</p>
                    <p class="environment-folder" data-environment-state>{{ row.running_agent_count ? "Agent: running" : "Agent: stopped" }} · {{ row.unfinished_task_count }} {{ row.unfinished_task_count === 1 ? "task" : "tasks" }} not done</p>
                    <template v-if="refusal[row.id]">
                        <p class="environment-refusal" role="alert" data-environment-refusal>{{ refusal[row.id] }}</p>
                    </template>
                </div>
                <template v-if="asking === row.id">
                    <Btn small data-environment-keep @click="asking = 0">Keep it</Btn>
                    <Btn small variant="danger" data-environment-confirm @click="remove(row)">Yes, remove</Btn>
                </template>
                <template v-else>
                    <Btn small variant="danger" data-environment-remove :disabled="here(row)" :title="here(row) ? 'Switch to another environment to remove this one' : 'Remove this environment'" @click="remove(row)">Remove environment</Btn>
                </template>
            </div>
        </template>
    </RowList>
</template>

<style scoped>
.environment {
    display: flex;
    flex: 1;
    gap: 8px;
    align-items: center;
    min-width: 0;
    padding: 8px 0;
}

.environment-names {
    flex: 1;
    min-width: 0;
}

.environment-name {
    font-weight: 500;
}

.environment-here {
    margin-left: 8px;
    color: var(--accent-text);
    font-size: 12px;
}

.environment-folder {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 12px;
    overflow-wrap: anywhere;
}

.environment-refusal {
    margin: 2px 0 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
