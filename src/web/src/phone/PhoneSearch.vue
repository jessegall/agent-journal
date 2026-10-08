<script setup>
import Skeleton from "../kit/Skeleton.vue";
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import {phone} from "../api/phone.js";
import {COMMANDS, PLACES} from "./everything.js";
import {kindTitle} from "./kinds.js";
import BigTitle from "./kit/BigTitle.vue";
import Cell from "./kit/Cell.vue";
import CellGroup from "./kit/CellGroup.vue";
import NavBar from "./kit/NavBar.vue";
import SearchField from "./kit/SearchField.vue";
import {useScrolled} from "./kit/scrolled.js";
import {moreHits} from "../domain/search.js";

const WAIT = 250;

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open", "command"]);
const words = ref("");
const items = ref([]);
const more = ref(0);
const searching = ref(false);
const {under, scrolled} = useScrolled();
const asked = computed(() => words.value.trim().toLowerCase());
const matches = (...texts) => texts.join(" ").toLowerCase().includes(asked.value);
const places = computed(() => (asked.value ? PLACES.filter((place) => matches(place.label, place.sub)) : []));
const commands = computed(() => (asked.value ? COMMANDS.filter((command) => matches(command.label)) : []));
let timer = 0;

const openFile = (item, file) => window.open(phone.fileUrl(item.type, item.n, file.name), "_blank");

watch(asked, (now) => {
    clearTimeout(timer);
    if (!now) return ([items.value, more.value] = [[], 0]);
    timer = setTimeout(async () => {
        searching.value = true;
        try {
            const found = await api.search(now);
            if (asked.value === now) [items.value, more.value] = [found.hits, found.more];
        } catch {
            [items.value, more.value] = [[], 0];
        } finally {
            searching.value = false;
        }
    }, WAIT);
});
</script>

<template>
    <div class="screen">
        <NavBar title="Search" :back="back" :under="under" @back="emit('back')" />
        <div class="screen-scroll" data-scroller @scroll.passive="scrolled">
            <BigTitle title="Search" />
            <SearchField v-model="words" label="Search places, commands and items" />
            <template v-if="places.length || commands.length">
                <CellGroup head="Places and commands">
                    <template v-for="place in places" :key="place.key">
                        <Cell :label="place.label" :sub="place.sub" :icon="place.icon" @pick="emit('open', place.route)" />
                    </template>
                    <template v-for="command in commands" :key="command.key">
                        <Cell :label="command.label" sub="Command" icon="arrow" @pick="emit('command', command.key)" />
                    </template>
                </CellGroup>
            </template>
            <template v-if="items.length">
                <CellGroup head="Items">
                    <template v-for="item in items" :key="item.ref">
                        <Cell
                            :label="item.title"
                            :sub="[`${kindTitle(item.type)} ${item.n}`, item.abstract].filter(Boolean).join(' · ')"
                            @pick="emit('open', item.ref)"
                        />
                        <template v-for="file in item.matches || []" :key="`${item.ref}/${file.name}`">
                            <Cell
                                :label="file.name"
                                :sub="file.tags || 'Attached file'"
                                icon="clip"
                                :indent="1"
                                @pick="openFile(item, file)"
                            />
                        </template>
                    </template>
                </CellGroup>
            </template>
            <template v-if="searching">
                <Skeleton shape="cards" :count="3" label="Searching" />
            </template>
            <template v-if="asked && !searching && !items.length && !places.length && !commands.length">
                <p class="search-none">Nothing matches “{{ words }}”.</p>
            </template>
            <template v-if="more">
                <p class="search-none">{{ moreHits(more) }}</p>
            </template>
            <p class="search-help">Finds places, commands, titles, text and attached files.</p>
        </div>
    </div>
</template>

<style scoped>
.search-none,
.search-help {
    margin: 12px 4px 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}
</style>
