<script setup>
import {computed} from "vue";
import {RowList, WindowRoom, useWindow} from "@journal/window-kit";

const view = useWindow();
view.state["points.agent"] = String(view.agent);
const {data, failure, loaded} = view.props.points;
const points = computed(() => data.value?.points ?? []);
</script>

<template>
    <WindowRoom>
        <RowList :rows="points" :failure="failure" :loaded="loaded" empty="This agent has no task brief to prove" hint="Task requirements and the evidence for each appear here.">
            <template #default="{row}">
                <span class="number">{{ row.id }}</span>
                <span class="main">
                    <span>{{ row.text }}</span>
                    <span class="note">{{ row.proof ? `${row.proof.state}: ${row.proof.text}` : "no proof yet" }}</span>
                    <template v-if="row.proof && row.proof.shortfall">
                        <span class="note">missing: {{ row.proof.shortfall }}</span>
                    </template>
                </span>
            </template>
        </RowList>
    </WindowRoom>
</template>

<style scoped>
.number {
    color: var(--text-3);
    font-size: 12px;
}

.main {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
