<script setup>
import {meta} from "../domain/tables.js";
import SectionHeading from "../kit/SectionHeading.vue";
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {peek} from "../route.js";
import {byRef, linkedTo, linksOf, refParts} from "../domain/records.js";
import {refOf, titleOf, updatedAt} from "../domain/row.js";
import {age} from "../format/time.js";

const props = defineProps({resource: Object, except: {type: Array, default: () => []}});
const shown = (ref) => meta(refParts(ref).table) && !meta(refParts(ref).table).nested && !props.except.includes(ref);
// A comment is drawn under its row with the others, not again as a link.
const commentless = (r) => !(r.comments_on || r.on || []).length;
const bar = (ref, direction) => {
    const {table, id} = refParts(ref);
    const r = byRef(ref);
    return {key: `${direction}${ref}`, ref, direction, icon: meta(table).icon, title: r ? titleOf(r) : `${meta(table).title} ${id}`, age: r ? age(updatedAt(r)) : ""};
};
const rows = computed(() => {
    const listed = [...linksOf(props.resource).filter(shown).map((r) => bar(r, "to")), ...linkedTo(refOf(props.resource)).filter(commentless).map(refOf).filter(shown).map((r) => bar(r, "from"))];
    return listed.filter((row, i) => listed.findIndex((other) => other.ref === row.ref) === i);
});
const DIRECTIONS = [
    {key: "to", title: "Links to"},
    {key: "from", title: "Linked by"},
];
const groups = computed(() =>
    DIRECTIONS.map((d) => ({...d, rows: rows.value.filter((r) => r.direction === d.key)})).filter((d) => d.rows.length)
);
const open = (ref) => {
    const {table, id} = refParts(ref);
    peek(table, id);
};
</script>

<template>
    <template v-if="rows.length">
        <template v-for="g in groups" :key="g.key">
            <section class="links">
                <SectionHeading>{{ g.title }}</SectionHeading>
                <template v-for="r in g.rows" :key="r.key">
                    <button type="button" class="bar" @click="open(r.ref)">
                        <Icon :name="r.icon" :size="13" />
                        <span class="bar-title">{{ r.title }}</span>
                        <span class="bar-age">{{ r.age }}</span>
                    </button>
                </template>
            </section>
        </template>
    </template>
</template>

<style scoped>
.links {
    margin-top: 16px;
}

.bar {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    min-width: 0;
    height: 32px;
    padding: 0 10px;
    margin-bottom: 4px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.bar:hover {
    border-color: var(--border-2);
    background: var(--hover);
}

.bar .ico {
    flex: none;
    color: var(--text-3);
}

.bar-title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}

.bar-age {
    flex: none;
    width: 3ch;
    font-size: 11px;
    color: var(--text-3);
    text-align: right;
}
</style>
