<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {HELPER_WORDS, helperLine, helperState, helpersInOrder} from "../domain/helpers.js";

const props = defineProps({rows: {type: Array, default: () => []}});
const emit = defineEmits(["changed"]);
const listed = computed(() => helpersInOrder(props.rows));
const busy = ref(0);
const told = ref("");

async function act(row, action) {
    busy.value = row.n;
    told.value = "";
    try {
        await api.act("helper", row.n, action);
        emit("changed");
    } catch (e) {
        told.value = e.message;
    } finally {
        busy.value = 0;
    }
}
</script>

<template>
    <h4 class="helpers-heading">Helpers</h4>
    <template v-if="!listed.length">
        <p class="helpers-none">No helper has been dispatched here.</p>
    </template>
    <template v-if="told">
        <p class="helpers-told">{{ told }}</p>
    </template>
    <template v-for="row in listed" :key="row.n">
        <div :class="['helper', helperState(row)]">
            <div class="helper-head">
                <span :class="['helper-dot', helperState(row)]" />
                <span class="helper-what">
                    <strong>{{ row.data?.name || `Helper ${row.n}` }}</strong>
                    {{ row.title }}
                    <small>{{ helperLine(row) }}</small>
                </span>
                <span :class="['helper-state', helperState(row)]">{{ HELPER_WORDS[helperState(row)] }}</span>
                <template v-if="helperState(row) === 'running'">
                    <Btn small :busy="busy === row.n" @click="act(row, 'stop')">Stop</Btn>
                </template>
                <template v-else-if="helperState(row) === 'reported'">
                    <Btn small kind="primary" :busy="busy === row.n" @click="act(row, 'complete')">Finish</Btn>
                </template>
            </div>
            <template v-if="row.data?.report">
                <TextDisplay class="helper-report" :text="row.data.report" />
            </template>
        </div>
    </template>
</template>

<style scoped>
.helpers-heading {
    margin: 0 0 6px;
    color: var(--text-2);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.helpers-none,
.helpers-told {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
}

.helper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 7px 8px;
    border-radius: 6px;
}

.helper + .helper {
    border-top: 1px solid var(--line);
}

.helper.finished {
    opacity: 0.7;
}

.helper-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.helper-dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-4);
}

.helper-dot.running {
    background: var(--accent);
}

.helper-dot.reported {
    background: var(--tone-good);
}

.helper-what {
    flex: 1;
    min-width: 0;
    color: var(--text);
    font-size: 12.5px;
}

.helper-what small {
    display: block;
    color: var(--text-3);
    font-size: 11px;
}

.helper-state {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
}

.helper-state.reported {
    color: var(--tone-good);
}

.helper-report {
    margin-left: 15px;
    padding: 6px 8px;
    border-left: 2px solid var(--line);
    color: var(--text-2);
    font-size: 12px;
}
</style>
