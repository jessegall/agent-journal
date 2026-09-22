<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {peek} from "../route.js";
import {byRef, linkedTo, refParts} from "../domain/records.js";
import {age} from "../format/time.js";
import {meta} from "../state/store.js";

const props = defineProps({resource: Object, except: {type: Array, default: () => []}});
const skip = (type) => meta(type).nested || (meta(type).fields.options && meta(type).needs_attention);
const bar = (ref, direction) => {
    const {type, n, part} = refParts(ref);
    const r = byRef(ref);
    return {
        key: `${direction}${ref}`,
        ref,
        icon: meta(type).icon,
        title: `${r ? r.title : `${meta(type).title} ${n}`}${part ? ` · ${/^\d/.test(part) ? `lines ${part}` : part}` : ""}`,
        age: r ? age(r.updated || r.created) : "",
    };
};
const rows = computed(() => {
    const listed = [
        ...props.resource.refs.filter((r) => !skip(refParts(r).type) && !props.except.includes(r)).map((r) => bar(r, "to")),
        ...linkedTo(props.resource.ref)
            .filter((r) => !skip(r.type) && !props.except.includes(r.ref))
            .map((r) => bar(r.ref, "from")),
    ];
    return listed.filter((row, i) => listed.findIndex((other) => other.ref === row.ref) === i);
});
const open = (ref) => {
    const {type, n, part} = refParts(ref);
    peek(type, n, 0, part ? encodeURIComponent(part) : "");
};
</script>

<template>
    <template v-if="rows.length">
        <section class="links">
            <h3>Resources</h3>
            <template v-for="r in rows" :key="r.key">
                <button type="button" class="bar" @click="open(r.ref)">
                    <Icon :name="r.icon" :size="13" />
                    <span class="bar-title">{{ r.title }}</span>
                    <span class="bar-age">{{ r.age }}</span>
                </button>
            </template>
        </section>
    </template>
</template>

<style scoped>
.links {
    margin-top: 16px;
}

h3 {
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
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
