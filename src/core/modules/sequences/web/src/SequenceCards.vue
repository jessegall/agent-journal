<script setup>
import {Icon, useOpenRow, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("sequence list", ["sequence.*"]);
const {opened, toggle} = useOpenRow();
</script>

<template>
    <div class="cards">
        <template v-if="failure">
            <p class="cards-note">{{ failure }}</p>
        </template>
        <template v-else-if="loaded && !rows.length">
            <p class="cards-note">No sequences yet</p>
        </template>
        <template v-for="row in rows" :key="row.id">
            <button type="button" :class="['card', {open: opened === row.id}]" :data-row="row.id" @click="toggle(row)">
                <span class="card-head"><Icon name="list" class="card-icon" /> Sequence {{ row.id }}</span>
                <span class="card-title">{{ row.title }}</span>
                <template v-if="opened === row.id">
                    <ol class="card-steps">
                        <template v-for="step in row.steps" :key="step">
                            <li>{{ step }}</li>
                        </template>
                    </ol>
                </template>
                <span class="card-foot">{{ row.steps.length }} steps · Only when you or the agent start it</span>
            </button>
        </template>
    </div>
</template>

<style scoped>
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    align-content: start;
    padding: 16px 20px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 130px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.card:hover,
.card.open {
    border-color: var(--border-strong, var(--border));
}

.card-head {
    display: flex;
    gap: 6px;
    align-items: center;
    color: var(--text-2);
    font-size: 13px;
}

.card-icon {
    width: 14px;
    height: 14px;
}

.card-title {
    font-weight: 600;
}

.card-steps {
    margin: 0;
    padding-left: 18px;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.6;
}

.card-foot {
    margin-top: auto;
    color: var(--text-3);
    font-size: 12px;
}

.cards-note {
    margin: 0;
    color: var(--text-2);
}
</style>
