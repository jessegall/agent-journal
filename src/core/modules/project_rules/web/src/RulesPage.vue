<script setup>
import {computed, ref} from "vue";
import {Btn, RowList, useWindow, WindowRoom} from "@journal/window-kit";

const PROPOSED = "proposed";
const STATE_ORDER = [PROPOSED, "active"];

// the rules of the project: what holds for every agent, and what agents proposed, which waits on a person
const context = useWindow();
const {rows, failure, loaded, more, load, older} = context.props.rules;
const shown = computed(() => STATE_ORDER.flatMap((state) => rows.value.filter((row) => row.state === state)));
const refusal = ref("");

async function move(verb, rule) {
    const answer = await context.run(["rule", verb, String(rule.id)]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) load();
}
</script>

<template>
    <WindowRoom>
        <div class="rules-page">
            <template v-if="refusal">
                <p class="rules-refusal" role="alert" data-rule-refusal>{{ refusal }}</p>
            </template>
            <RowList :rows="shown" :failure="failure" :loaded="loaded" :more="more" :older="older" empty="No rules yet" hint="Rules you add or approve hold for every agent.">
                <template #default="{row}">
                    <div class="rule" :data-rule="row.id" :data-rule-state="row.state">
                        <span class="rule-text">{{ row.text }}</span>
                        <template v-if="row.state === PROPOSED">
                            <span class="rule-state">State: proposed</span>
                            <Btn small variant="primary" @click="move('approve', row)">Approve</Btn>
                            <Btn small bordered @click="move('deny', row)">Deny</Btn>
                        </template>
                        <template v-else>
                            <Btn small bordered @click="move('remove', row)">Remove</Btn>
                        </template>
                    </div>
                </template>
            </RowList>
        </div>
    </WindowRoom>
</template>

<style scoped>
.rules-page {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.rules-refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.rule {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    min-width: 0;
    padding: 4px 0;
}

.rule-text {
    flex: 1 1 240px;
    min-width: 0;
}

.rule-state {
    color: var(--warn);
    font-size: 12px;
}
</style>
