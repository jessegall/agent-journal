<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {GROUPS, KIND_PLACES} from "./everything.js";
import BigTitle from "./kit/BigTitle.vue";
import Cell from "./kit/Cell.vue";
import CellGroup from "./kit/CellGroup.vue";
import Icon from "../kit/Icon.vue";
import NavBar from "./kit/NavBar.vue";
import {useScrolled} from "./kit/scrolled.js";

defineProps({connection: {type: Object, required: true}});
const emit = defineEmits(["open"]);
const counts = ref({});
const {under, scrolled} = useScrolled();

onMounted(async () => {
    try {
        counts.value = (
            await api.dashboard(
                KIND_PLACES.map((place) => place.type),
                {last: 1}
            )
        ).counts;
    } catch {
        counts.value = {};
    }
});

const countOf = (place) => (place.type && counts.value[place.type] ? counts.value[place.type].open : "");
const hot = (place) => Boolean(place.type && counts.value[place.type]?.unread);
</script>

<template>
    <div class="screen">
        <NavBar title="Everything" :under="under" />
        <div class="screen-scroll" data-scroller @scroll.passive="scrolled">
            <BigTitle title="Everything" :sub="`Every place in ${connection.project}`" />
            <button type="button" class="everything-search" @click="emit('open', 'search:')">
                <Icon name="search" :size="17" />
                <span>Search everything in {{ connection.environment }}</span>
            </button>
            <template v-for="group in GROUPS" :key="group.key">
                <CellGroup :head="group.head(connection.environment)" :line="group.line">
                    <template v-for="place in group.places" :key="place.key">
                        <Cell
                            :label="place.label"
                            :sub="place.sub"
                            :icon="place.icon"
                            :count="countOf(place)"
                            :hot="hot(place)"
                            @pick="emit('open', place.route)"
                        />
                    </template>
                </CellGroup>
            </template>
        </div>
    </div>
</template>

<style scoped>
.everything-search {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: none;
    min-height: 44px;
    margin: 0 0 6px;
    padding: 0 10px;
    border: 0;
    border-radius: 10px;
    background: var(--sel);
    color: var(--text-3);
    font: inherit;
    font-size: 1.0625rem;
    text-align: left;
}
</style>
