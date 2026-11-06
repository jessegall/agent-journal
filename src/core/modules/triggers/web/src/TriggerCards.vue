<script setup>
import {computed, ref} from "vue";
import {Btn, EmptyState, Icon, Skeleton, useWindow} from "@journal/window-kit";
import TriggerDialog from "./TriggerDialog.vue";

// the triggers as slips on one ruled sheet: only a name, a short line and a number; a slip opens the one dialog that holds everything else
const window = useWindow();
const {rows, failure, loaded, act} = window.props.triggers;
const drafting = ref(false);
const openedId = ref(null);
const opened = computed(() => rows.value.find((row) => row.id === openedId.value) || null);
const nameOf = (row) => row.name || row.text;
const lineOf = (row) => row.description || row.text;
const closed = () => {
    drafting.value = false;
    openedId.value = null;
};
</script>

<template>
    <section class="trigger-page">
        <div class="trigger-bar">
            <span class="trigger-sum">{{ rows.length ? `${rows.length} ${rows.length === 1 ? "trigger" : "triggers"}` : "No triggers" }}</span>
            <Btn variant="primary" icon="plus" data-trigger-new @click="drafting = true">New trigger</Btn>
        </div>
        <div class="trigger-body">
            <p class="trigger-lead">A trigger watches for something and then does something. It can remind the agent, tell it what to do now, or block a command or a file change. Click one to see and change how it works.</p>
            <template v-if="failure">
                <EmptyState title="Could not read the triggers" :hint="failure" />
            </template>
            <template v-else-if="!loaded">
                <Skeleton shape="cards" />
            </template>
            <template v-else-if="rows.length">
                <div class="slips">
                    <template v-for="row in rows" :key="row.id">
                        <button type="button" class="slip" :data-row="row.id" @click="openedId = row.id">
                            <span class="slip-name">{{ nameOf(row) }}</span>
                            <span class="slip-line">{{ lineOf(row) }}</span>
                            <span class="slip-foot"><span>#{{ row.id }}<template v-if="row.needs_enabling"> · Waiting for you</template><template v-if="row.paused_at"> · Paused</template></span><Icon class="slip-go" name="arrow" :size="14" /></span>
                        </button>
                        <template v-if="row.needs_enabling">
                            <Btn small bordered data-trigger-enable @click="act(`trigger enable ${row.id}`)">Enable trigger</Btn>
                        </template>
                    </template>
                </div>
            </template>
            <template v-else>
                <p class="trigger-none"><strong>No triggers yet</strong>Triggers you create appear here.</p>
                <button type="button" class="make" @click="drafting = true">
                    <span class="make-title">New trigger</span>
                    <span class="make-text">Give it a name, say what to watch for, and say what should happen.</span>
                </button>
            </template>
        </div>
        <template v-if="drafting || opened">
            <TriggerDialog :trigger="opened" @close="closed" />
        </template>
    </section>
</template>

<style scoped>
.trigger-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    container-type: inline-size;
}

.trigger-bar {
    display: flex;
    flex: none;
    gap: 10px;
    align-items: center;
    min-height: 45px;
    padding: 8px 14px 8px 22px;
    border-bottom: 1px solid var(--border);
}

.trigger-sum {
    flex: 1;
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

.trigger-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 22px;
    width: 100%;
    max-width: 1180px;
    min-height: 0;
    padding: 22px 24px 40px;
    overflow: auto;
}

.trigger-lead,
.trigger-none {
    max-width: 640px;
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.55;
}

.trigger-none strong {
    display: block;
    margin-bottom: 4px;
    color: var(--text-2);
    font-size: 14px;
    font-weight: 500;
}

.slips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: 1fr;
    border-top: 1px solid var(--border);
    border-left: 1px solid var(--border);
}

.slip {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    min-height: 148px;
    padding: 20px 20px 16px;
    border: 0;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s;
}

.slip:hover {
    background: var(--raised);
}

.slip:hover .slip-go {
    color: var(--accent-text);
    transform: translateX(3px);
}

.slip-name {
    color: var(--text);
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
}

.slip-line {
    display: -webkit-box;
    min-height: 3.9em;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.55;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}

.slip-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    color: var(--text-4);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11px;
}

.slip-go {
    transition: transform 0.15s, color 0.15s;
}

.make {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 420px;
    min-height: 148px;
    padding: 20px;
    border: 1px dashed var(--border-2);
    background: none;
    color: var(--text-3);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.make:hover {
    border-color: var(--accent);
    background: var(--hover);
}

.make-title {
    color: var(--text-2);
    font-size: 16px;
    font-weight: 600;
}

.make-text {
    max-width: 300px;
    font-size: 12.5px;
    line-height: 1.55;
}

@container (max-width: 640px) {
    .trigger-bar {
        padding: 8px 12px 8px 16px;
    }

    .trigger-body {
        padding: 16px 16px 32px;
    }

    .slips {
        grid-template-columns: minmax(0, 1fr);
    }

    .slip {
        min-height: 0;
    }
}
</style>
