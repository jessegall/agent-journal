<script setup>
import {computed} from "vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {reviewRounds} from "../domain/plans.js";
import {peek} from "../route.js";

const props = defineProps({plan: {type: Object, required: true}});
const rounds = computed(() => reviewRounds(props.plan));
</script>

<template>
    <template v-if="rounds.length">
        <section class="rounds">
            <h3 class="heading">Review rounds</h3>
            <ol class="list">
                <template v-for="round in rounds" :key="round.id">
                    <li class="round">
                        <div class="head">
                            <span class="title">{{ round.title }}</span>
                            <span class="at">{{ round.when }}</span>
                            <template v-if="round.reviewers">
                                <span class="reviewers" :title="round.names">{{ round.reviewers }}</span>
                            </template>
                            <template v-for="n in round.reports" :key="n">
                                <button type="button" class="report" :title="`Open report ${n}`" @click="peek('reports', n)">Report {{ n }}</button>
                            </template>
                        </div>
                        <TextDisplay class="changed" :text="round.changed" />
                    </li>
                </template>
            </ol>
        </section>
    </template>
</template>

<style scoped>
.rounds {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 24px;
}

.heading {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    font-weight: 600;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
}

.head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px;
    font-size: 12px;
}

.title {
    color: var(--text);
    font-weight: 600;
}

.at,
.reviewers {
    color: var(--text-3);
}

.report {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.report:hover {
    text-decoration: underline;
}

.changed {
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
