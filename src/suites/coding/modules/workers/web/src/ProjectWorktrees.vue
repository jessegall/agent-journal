<script setup>
import {ref} from "vue";
import {Btn, RowList, WindowRoom, removed, useWindow} from "@journal/window-kit";

// the worktrees of this repository and who holds each; removing one asks first, shows it gone at once, keeps its branch and says why when it is refused
const window = useWindow();
const {rows, failure, loaded, act} = window.props.worktrees;
const asking = ref("");
const refusal = ref({});

function holder(row) {
    if (row.is_checkout) return "Main checkout";
    if (row.worker_id !== null) return `Worker ${row.worker_id}`;
    if (row.agent_count) return `Environment ${row.environment}, agent running`;
    return row.environment ? `Environment ${row.environment}` : "No environment";
}

const isHeld = (row) => row.is_checkout || row.worker_id !== null || row.agent_count > 0;

async function remove(row) {
    if (asking.value !== row.id) return void (asking.value = row.id);
    asking.value = "";
    const answer = await act(["project-worktree", "remove", row.folder], removed(row.id));
    refusal.value = {...refusal.value, [row.id]: answer.ok ? "" : answer.error};
}
</script>

<template>
    <WindowRoom>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No worktrees" hint="Worker working copies appear here until their changes are merged.">
            <template #default="{row}">
                <div class="worktree" :data-worktree="row.folder">
                    <div class="worktree-names">
                        <span class="worktree-holder">{{ holder(row) }}</span>
                        <p class="worktree-folder">{{ row.folder }}{{ row.branch ? ` on ${row.branch}` : "" }}</p>
                        <template v-if="refusal[row.id]">
                            <p class="worktree-refusal" role="alert" data-worktree-refusal>{{ refusal[row.id] }}</p>
                        </template>
                    </div>
                    <template v-if="asking === row.id">
                        <Btn small data-worktree-keep @click="asking = ''">Keep it</Btn>
                        <Btn small variant="danger" data-worktree-confirm @click="remove(row)">Yes, remove the folder</Btn>
                    </template>
                    <template v-else-if="!isHeld(row)">
                        <Btn small variant="danger" title="Remove this worktree folder, keeping its branch" data-worktree-remove @click="remove(row)">Remove worktree</Btn>
                    </template>
                </div>
            </template>
        </RowList>
    </WindowRoom>
</template>

<style scoped>
.worktree {
    display: flex;
    flex: 1;
    gap: 8px;
    align-items: center;
    min-width: 0;
    padding: 8px 0;
}

.worktree-names {
    flex: 1;
    min-width: 0;
}

.worktree-holder {
    font-weight: 500;
}

.worktree-folder {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 12px;
    overflow-wrap: anywhere;
}

.worktree-refusal {
    margin: 2px 0 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
