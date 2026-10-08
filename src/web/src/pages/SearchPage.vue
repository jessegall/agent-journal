<script setup>
import Btn from "../kit/Btn.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import ToggleItem from "../kit/ToggleItem.vue";
import {useAnchoredAction} from "../composables/anchored.js";
import {store} from "../state/store.js";
import CardSkeleton from "../kit/CardSkeleton.vue";
import EmptyState from "../kit/EmptyState.vue";
import Switch from "../kit/Switch.vue";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import TextInput from "../kit/TextInput.vue";
import {go, peek, route} from "../route.js";
import ResourceCard from "../resource/ResourceCard.vue";
import {moreHits} from "../domain/search.js";

const q = ref(route.value.q);
const hits = ref([]);
const more = ref(0);
const attic = ref(false);
const archived = ref(false);
const picked = ref([]);
const {anchor, toggle} = useAnchoredAction();
const types = computed(() => (store.spec?.searchable || []).map((key) => ({key, title: store.spec.types[key]?.title || key})));
const typesWord = computed(() => (picked.value.length ? `${picked.value.length} of ${types.value.length} types` : "Every type"));
const pick = (key) => (picked.value = picked.value.includes(key) ? picked.value.filter((k) => k !== key) : [...picked.value, key]);
const brought = ref({});
const removed = ref([]);
const restored = ref({});
const searching = ref(false);
const input = ref(null);
let request = 0;

onMounted(() => nextTick(() => input.value?.focus()));

async function run() {
    const current = ++request;
    const query = q.value.trim();
    go(route.value.env, "search", 0, q.value);
    hits.value = [];
    more.value = 0;
    removed.value = [];
    searching.value = !!query;
    if (!query) {
        return;
    }
    try {
        const [found, gone] = await Promise.all([api.search(query, archived.value, picked.value), attic.value ? api.searchAttic(query) : []]);
        if (current === request) [hits.value, more.value, removed.value] = [found.hits, found.more, gone];
    } finally {
        if (current === request) searching.value = false;
    }
}

async function restore(r) {
    await api.restore(r.type, r.n);
    brought.value = {...brought.value, [r.ref]: true};
}

async function bringBack(name) {
    await api.unarchive(name);
    restored.value = {...restored.value, [name]: true};
}

watch([attic, archived, picked], run);

watch(
    () => route.value.q,
    (v) => {
        q.value = v;
        run();
    },
    {immediate: true}
);
</script>

<template>
    <section class="search">
        <form class="box" @submit.prevent="run">
            <Icon name="search" />
            <TextInput
                ref="input"
                :value="q"
                placeholder="Search everything on this environment…"
                autofocus
                @input="q = $event.target.value"
            />
        </form>
        <div class="switches">
            <Btn small :aria-expanded="!!anchor" @click="toggle">{{ typesWord }}</Btn>
            <template v-if="anchor">
                <MenuPanel :anchor="anchor" :min-width="200" :max-width="260" @click.stop @close="anchor = null">
                    <template v-for="t in types" :key="t.key">
                        <ToggleItem :on="picked.includes(t.key)" @click="pick(t.key)">{{ t.title }}</ToggleItem>
                    </template>
                </MenuPanel>
            </template>
            <Switch :on="archived" word="Include archived items" @change="(on) => (archived = on)" />
            <Switch :on="attic" word="Include removed environments" @change="(on) => (attic = on)" />
        </div>
        <template v-if="searching">
            <CardSkeleton class="cards" />
        </template>
        <template v-if="route.q && !searching && !hits.length && !removed.length">
            <EmptyState class="empty">Nothing matches “{{ route.q }}”.</EmptyState>
        </template>
        <div class="cards">
            <template v-for="r in hits" :key="r.ref">
                <div :class="['hit', {filed: r.matches.length}]">
                    <ResourceCard :resource="r" @click="peek(r.type, r.n)" />
                    <template v-if="r.deleted">
                        <div class="archived">
                            <span>Archived</span>
                            <template v-if="brought[r.ref]">
                                <small>Brought back</small>
                            </template>
                            <template v-else>
                                <Btn small @click="restore(r)">Bring back</Btn>
                            </template>
                        </div>
                    </template>
                    <template v-if="r.matches.length">
                        <div class="matches">
                            <template v-for="f in r.matches" :key="f.name">
                                <a :href="f.url" target="_blank">
                                    <span>{{ f.name }}</span>
                                    <template v-if="f.tags">
                                        <small>{{ f.tags }}</small>
                                    </template>
                                </a>
                            </template>
                        </div>
                    </template>
                </div>
            </template>
        </div>
        <template v-if="more">
            <p class="more">{{ moreHits(more) }}</p>
        </template>
        <template v-if="removed.length">
            <h3 class="removed-head">In removed environments</h3>
            <ul class="removed">
                <template v-for="hit in removed" :key="`${hit.environment}-${hit.ref}`">
                    <li>
                        <span class="removed-place">{{ hit.environment }} · {{ hit.ref.replace(":", " ") }}</span>
                        <span class="removed-title">{{ hit.title }}</span>
                        <template v-if="restored[hit.environment]">
                            <small>Brought back</small>
                        </template>
                        <template v-else>
                            <Btn small @click="bringBack(hit.environment)">Bring back {{ hit.environment }}</Btn>
                        </template>
                    </li>
                </template>
            </ul>
        </template>
    </section>
</template>

<style scoped>
.search {
    padding: 18px 22px;
}

.box {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 720px;
    padding: 10px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-3);
}

.box input {
    flex: 1;
    border: 0;
    background: none;
    outline: none;
    color: var(--text);
}

.empty {
    margin: 16px 0;
}

.more {
    margin: 16px 0;
    color: var(--text-3);
}

.switches {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 22px;
    margin-top: 12px;
}

.archived {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 4px 0;
    color: var(--text-3);
    font-size: 12px;
}

.removed-head {
    margin: 22px 0 8px;
    font-size: 13px;
    color: var(--text-2);
}

.removed {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 720px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.removed li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
}

.removed-place {
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}

.removed-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    grid-auto-rows: 1fr;
    gap: 12px;
    margin-top: 18px;
}

.hit {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.hit :deep(.card) {
    flex: 1;
}

.hit.filed :deep(.card) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.matches {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px 10px;
    border: 1px solid var(--border);
    border-top: 0;
    border-radius: 0 0 10px 10px;
}

.matches a {
    display: flex;
    gap: 7px;
    min-width: 0;
    color: var(--accent-text);
}

.matches span,
.matches small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.matches small {
    color: var(--text-3);
}
</style>
