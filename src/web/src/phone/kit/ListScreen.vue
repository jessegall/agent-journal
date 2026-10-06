<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import PhoneSkeletonRows from "../PhoneSkeletonRows.vue";
import BigTitle from "./BigTitle.vue";
import EmptyList from "./EmptyList.vue";
import NavBar from "./NavBar.vue";
import SearchField from "./SearchField.vue";
import {useScrolled} from "./scrolled.js";

const SKELETON_AFTER = 150;

const props = defineProps({
    title: {type: String, required: true},
    intro: {type: String, default: ""},
    back: {type: String, default: ""},
    load: {type: Function, required: true},
    keyOf: {type: Function, default: (row) => row.n},
    wordsOf: {type: Function, default: (row) => `${row.title} ${row.n}`},
    empty: {type: Object, required: true},
    keep: {type: Function, default: () => true},
    order: {type: Function, default: null},
});
const emit = defineEmits(["back", "act"]);
const rows = ref([]);
const more = ref(false);
const loading = ref(true);
const skeleton = ref(false);
const failed = ref("");
const busy = ref(false);
const words = ref("");
const end = ref(null);
const {under, scrolled} = useScrolled();
const shown = computed(() => {
    const asked = words.value.trim().toLowerCase();
    const kept = rows.value.filter((row) => props.keep(row) && (!asked || props.wordsOf(row).toLowerCase().includes(asked)));
    return props.order ? kept.sort(props.order) : kept;
});
let skeletonTimer = 0;
let watcher = null;

async function page(before) {
    busy.value = true;
    failed.value = "";
    try {
        const got = await props.load({before});
        rows.value = before ? [...rows.value, ...got.rows] : got.rows;
        more.value = got.more;
    } catch (error) {
        failed.value = error.message || "Your computer did not answer.";
    } finally {
        busy.value = false;
        loading.value = false;
        clearTimeout(skeletonTimer);
    }
}

function reload() {
    loading.value = true;
    return page(0);
}

function next() {
    if (busy.value || !more.value || !rows.value.length) return;
    page(rows.value.at(-1).n);
}

onMounted(() => {
    skeletonTimer = setTimeout(() => (skeleton.value = true), SKELETON_AFTER);
    watcher = new IntersectionObserver((seen) => seen.some((one) => one.isIntersecting) && next());
    if (end.value) watcher.observe(end.value);
    page(0);
});
onUnmounted(() => {
    clearTimeout(skeletonTimer);
    watcher?.disconnect();
});

defineExpose({reload, rows});
</script>

<template>
    <div class="screen">
        <NavBar :title="title" :back="back" :under="under" @back="emit('back')">
            <slot name="end" />
        </NavBar>
        <div class="screen-scroll" data-scroller @scroll.passive="scrolled">
            <BigTitle :title="title" />
            <template v-if="intro">
                <p class="screen-intro">{{ intro }}</p>
            </template>
            <SearchField v-model="words" :label="`Search ${title.toLowerCase()}`" />
            <slot name="top" />
            <template v-if="loading">
                <div class="list-loading" aria-busy="true" aria-label="Loading">
                    <template v-if="skeleton">
                        <div class="list-group"><PhoneSkeletonRows :count="5" /></div>
                    </template>
                </div>
            </template>
            <template v-else-if="failed && !rows.length">
                <EmptyList icon="warn" title="This list did not load" :reason="failed" action="Try again" @act="reload" />
            </template>
            <template v-else-if="!rows.length">
                <EmptyList :icon="empty.icon" :title="empty.title" :reason="empty.reason" :action="empty.action" @act="emit('act')" />
            </template>
            <template v-else>
                <div class="list-group">
                    <template v-for="row in shown" :key="keyOf(row)">
                        <slot name="row" :row="row" />
                    </template>
                </div>
                <template v-if="words && !shown.length">
                    <p class="list-none">Nothing loaded so far matches “{{ words }}”.</p>
                </template>
            </template>
            <span ref="end" class="list-end" />
            <template v-if="more && !loading">
                <button type="button" class="list-more" :disabled="busy" @click="next">{{ busy ? "Loading…" : "Show more" }}</button>
            </template>
            <slot name="bottom" />
        </div>
        <template v-if="$slots.foot">
            <footer class="screen-foot">
                <slot name="foot" />
            </footer>
        </template>
    </div>
</template>

<style scoped>
.screen-intro {
    max-width: none;
    margin: 0 0 14px;
    color: var(--text-3);
    font-size: 0.9375rem;
    text-wrap: pretty;
}

.list-group {
    overflow: hidden;
    border-radius: 12px;
    background: var(--raised);
}

.list-none {
    color: var(--text-3);
    text-align: center;
}

.list-end {
    display: block;
    height: 1px;
}

.list-more {
    width: 100%;
    min-height: 44px;
    margin-top: 10px;
    border: 0;
    border-radius: 12px;
    background: var(--sel);
    color: var(--accent-text);
    font: inherit;
}
</style>
