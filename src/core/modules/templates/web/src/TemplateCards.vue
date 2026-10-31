<script setup>
import {Icon, useOpenRow, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("template list", ["template.*"]);
const {opened, toggle} = useOpenRow();
</script>

<template>
    <div class="cards">
        <template v-if="failure">
            <p class="cards-note">{{ failure }}</p>
        </template>
        <template v-else-if="loaded && !rows.length">
            <p class="cards-note">No templates yet</p>
        </template>
        <template v-for="row in rows" :key="row.id">
            <button type="button" :class="['card', {open: opened === row.id}]" :data-row="row.id" @click="toggle(row)">
                <span class="card-head"><Icon name="board" class="card-icon" /> Template {{ row.id }}</span>
                <span class="card-title">{{ row.title }}</span>
                <span class="card-brief">{{ row.brief }}</span>
                <template v-if="opened === row.id">
                    <ul class="card-steps">
                        <template v-for="part in row.parts" :key="part">
                            <li>{{ part }}</li>
                        </template>
                        <template v-for="command in row.commands" :key="command">
                            <li>Runs at each phase end: <code>{{ command }}</code></li>
                        </template>
                    </ul>
                </template>
                <span class="card-foot">For {{ row.targets.length ? row.targets.join(", ") : "any row" }}{{ row.purpose ? ` · ${row.purpose}` : "" }}</span>
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

.card-brief {
    color: var(--text-2);
    font-size: 13px;
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
