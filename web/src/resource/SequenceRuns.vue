<script setup>
import {computed} from "vue";
import {peek, route} from "../route.js";
import {rows} from "../sync/rows.js";

const props = defineProps({resource: Object});
const BY_HAND = "by hand";

const runs = computed(() =>
    (props.resource.type === "sequence" ? [props.resource] : rows("sequence").filter((s) => !s.deleted)).flatMap((s) =>
        Object.entries(s.data.runs || {})
            .map(([key, step]) => ({sequence: s, env: key.split("|")[0], about: key.split("|").slice(1).join("|"), step}))
            .filter((r) => r.env === route.value.env && (props.resource.type === "sequence" || r.about === props.resource.ref))
    )
);

function open(ref) {
    const [type, n] = ref.split(":");
    peek(type, Number(n));
}
</script>

<template>
    <template v-if="runs.length">
        <section class="runs">
            <h3>Running now</h3>
            <div v-for="r in runs" :key="`${r.sequence.n}-${r.about}`" class="run">
                <div class="run-head">
                    <template v-if="resource.type === 'sequence'">
                        <span>{{ r.about === BY_HAND ? "Started by hand" : "About" }}</span>
                        <template v-if="r.about !== BY_HAND">
                            <button type="button" class="run-link" @click="open(r.about)">{{ r.about.replace(":", " ") }}</button>
                        </template>
                    </template>
                    <template v-else>
                        <button type="button" class="run-link" @click="open(r.sequence.ref)">{{ r.sequence.title }}</button>
                    </template>
                    <span class="grow" />
                    <span class="run-count">step {{ r.step }} of {{ r.sequence.sections.length }}</span>
                </div>
                <ol class="steps">
                    <li v-for="(s, i) in r.sequence.sections" :key="s.title" :class="{done: i + 1 < r.step, current: i + 1 === r.step}">
                        {{ s.title }}
                    </li>
                </ol>
            </div>
        </section>
    </template>
</template>

<style scoped>
.runs {
    margin-top: 20px;
}

h3 {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.run {
    margin-bottom: 10px;
    padding: 12px 14px;
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border-2));
    border-radius: 9px;
    background: var(--raised);
}

.run-head {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-2);
    font-size: 12.5px;
}

.grow {
    flex: 1;
}

.run-link {
    padding: 0;
    border: none;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.run-count {
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.steps {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 10px 0 0;
    padding-left: 20px;
    color: var(--text-3);
    font-size: 12.5px;
}

.steps .done {
    text-decoration: line-through;
}

.steps .current {
    color: var(--text);
    font-weight: 500;
}
</style>
