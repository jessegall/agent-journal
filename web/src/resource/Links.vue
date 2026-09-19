<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {peek} from "../route.js";
import {age, byRef, linkedTo, meta} from "../store.js";

const props = defineProps({resource: Object});
const skip = (type) => meta(type).mirror || (meta(type).fields.options && meta(type).attention);
const bar = (ref, direction) => {
    const [type, n] = ref.split(":");
    const r = byRef(ref);
    return {
        key: `${direction}${ref}`,
        ref,
        icon: meta(type).icon,
        title: r ? r.title : `${meta(type).title} ${n}`,
        kind: `${meta(type).title.toLowerCase()} ${n}`,
        age: r ? age(r.updated || r.created) : "",
    };
};
const rows = computed(() => [
    ...props.resource.refs.filter((r) => !skip(r.split(":")[0])).map((r) => bar(r, "to")),
    ...linkedTo(props.resource.ref)
        .filter((r) => !skip(r.type))
        .map((r) => bar(r.ref, "from")),
]);
const open = (ref) => {
    const [t, n] = ref.split(":");
    peek(t, Number(n));
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
                    <span class="bar-kind">{{ r.kind }}</span>
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
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}

.bar-kind {
    flex: none;
    margin-left: auto;
    font-size: 11px;
    color: var(--text-3);
}

.bar-age {
    flex: none;
    width: 3ch;
    font-size: 11px;
    color: var(--text-3);
    text-align: right;
}
</style>
