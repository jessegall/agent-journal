<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";

const numbers = ref(null);
let timer = null;

async function load() {
    numbers.value = await api.developer();
}

onMounted(() => {
    load();
    timer = setInterval(load, 5000);
});
onUnmounted(() => clearInterval(timer));

async function reset() {
    numbers.value = await api.developerReset();
}

const slowestFirst = ref(false);
const logged = () => (numbers.value ? (slowestFirst.value ? numbers.value.slowest : numbers.value.recent) || [] : []);
const clock = (seconds) => new Date(seconds * 1000).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit"});
const row = (title, measured) => ({title, count: measured.count, average: measured.average_ms, slowest: measured.slowest_ms});
const rows = () =>
    numbers.value
        ? [row("Hooks", numbers.value.hooks), row("Requests", numbers.value.requests), ...Object.entries(numbers.value.by_kind).map(([kind, measured]) => row(`Hook ${kind}`, measured))]
        : [];
</script>

<template>
    <section class="developer-numbers">
        <div class="developer-head">
            <h3 class="developer-heading">Time to answer, in milliseconds</h3>
            <button class="developer-reset" type="button" @click="reset">Reset the counts</button>
        </div>
        <p class="developer-line">An average is a running total divided by a count, bumped on every measurement. A hook's time runs from the start of its script to the server's answer.</p>
        <table class="developer-table">
            <thead>
                <tr>
                    <th>What</th>
                    <th>Measured</th>
                    <th>Average</th>
                    <th>Slowest</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="line in rows()" :key="line.title">
                    <tr>
                        <td>{{ line.title }}</td>
                        <td>{{ line.count }}</td>
                        <td>{{ line.average }} ms</td>
                        <td>{{ line.slowest }} ms</td>
                    </tr>
                </template>
                <template v-if="!rows().length">
                    <tr>
                        <td colspan="4">Nothing measured yet</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div class="developer-head">
            <h3 class="developer-heading">{{ slowestFirst ? "The slowest of the newest thousand" : "The newest requests" }}</h3>
            <button class="developer-reset" type="button" @click="slowestFirst = !slowestFirst">{{ slowestFirst ? "Newest first" : "Slowest first" }}</button>
        </div>
        <table class="developer-table">
            <thead>
                <tr>
                    <th>When</th>
                    <th>Kind</th>
                    <th>Route or command</th>
                    <th>Milliseconds</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(line, index) in logged()" :key="index">
                    <tr>
                        <td>{{ clock(line.time) }}</td>
                        <td>{{ line.method }}</td>
                        <td>{{ line.route }}</td>
                        <td>{{ line.ms }} ms</td>
                    </tr>
                </template>
                <template v-if="!logged().length">
                    <tr>
                        <td colspan="4">Nothing logged yet</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </section>
</template>

<style scoped>
.developer-numbers {
    margin: 0 0 24px;
}

.developer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0 0 6px;
}

.developer-reset {
    padding: 4px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.developer-reset:hover {
    background: var(--hover);
}

.developer-heading {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
}

.developer-line {
    margin: 0 0 12px;
    color: var(--text); opacity: 0.7;
    font-size: 13px;
}

.developer-table {
    border-collapse: collapse;
    width: 100%;
    font-size: 13px;
}

.developer-table th,
.developer-table td {
    padding: 6px 10px;
    text-align: left;
    border-bottom: 1px solid var(--border);
}

.developer-table th {
    color: var(--text); opacity: 0.7;
    font-weight: 500;
}
</style>
