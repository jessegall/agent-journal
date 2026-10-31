<script setup>
import {ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {usePoll} from "../composables/poll.js";
import {useScope} from "../composables/scope.js";

// A slim strip at the right of the agent's status line while any process runs in the environment: a terminal icon and how many run.
// A click opens the list of every running process, each marked docked or not, and a click on one not docked docks its card
const scope = useScope();
const outputs = ref([]);
const open = ref(false);
const anchor = ref(null);
const refresh = usePoll("outputs.running", {take: (got) => Array.isArray(got?.outputs) && (outputs.value = got.outputs)});

async function dock(output) {
    if (output.docked || !output.card) return;
    await scope.api.act("messages", output.card, "dock");
    refresh();
}
</script>

<template>
    <template v-if="outputs.length">
        <div class="run-menu">
            <button ref="anchor" type="button" class="run-menu-strip" :aria-expanded="open" @click="open = !open">
                <Icon name="terminal" />
                <span>Running: {{ outputs.length }}</span>
            </button>
            <template v-if="open && anchor">
                <MenuPanel :anchor="anchor" :min-width="300" :max-width="420" @click.stop @close="open = false">
                    <ul class="run-menu-list">
                        <template v-for="output in outputs" :key="output.id">
                            <li>
                                <button
                                    type="button"
                                    :class="['run-menu-item', {docked: output.docked}]"
                                    :disabled="output.docked || !output.card"
                                    :title="output.command"
                                    @click="dock(output)"
                                >
                                    <span class="run-menu-title">{{ output.title }}</span>
                                    <span class="run-menu-state">{{ output.docked ? "Docked" : output.card ? "Dock it" : "Starting" }}</span>
                                </button>
                            </li>
                        </template>
                    </ul>
                </MenuPanel>
            </template>
        </div>
    </template>
</template>

<style scoped>
/* on the status line's own row, at its right end */
.run-menu {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
}

/* plain text with its icon in front, no card around it */
.run-menu-strip {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    padding: 2px 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    cursor: pointer;
}

.run-menu-strip:hover,
.run-menu-strip[aria-expanded="true"] {
    color: var(--text);
}

.run-menu-strip .ico {
    width: 12px;
    height: 12px;
}

.run-menu-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.run-menu-item {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 6px 8px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.run-menu-item:hover:not(:disabled) {
    background: var(--hover);
}

.run-menu-item:disabled {
    cursor: default;
}

.run-menu-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.run-menu-state {
    flex: none;
    color: var(--accent);
    font-size: 11px;
}

.run-menu-item:disabled .run-menu-state {
    color: var(--text-4);
}
</style>
