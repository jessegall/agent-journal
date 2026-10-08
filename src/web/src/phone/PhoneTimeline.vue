<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {MOMENTS, momentDays, timeOf} from "../domain/timeline.js";
import BigTitle from "./kit/BigTitle.vue";
import Cell from "./kit/Cell.vue";
import CellGroup from "./kit/CellGroup.vue";
import EmptyList from "./kit/EmptyList.vue";
import NavBar from "./kit/NavBar.vue";
import {useScrolled} from "./kit/scrolled.js";
import Skeleton from "../kit/Skeleton.vue";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const items = ref(null);
const failed = ref("");
const days = computed(() => momentDays(items.value || []));
const {under, scrolled} = useScrolled();
const subOf = (item) => [MOMENTS[item.kind].word, timeOf(item.at), item.kind === "started" ? "" : item.text].filter(Boolean).join(" · ");

async function load() {
    failed.value = "";
    try {
        items.value = await api.planTimeline(Number(props.target));
    } catch (error) {
        failed.value = error.message;
    }
}

onMounted(load);
</script>

<template>
    <div class="screen">
        <NavBar title="Timeline" :back="back" :under="under" @back="emit('back')" />
        <div class="screen-scroll" data-scroller @scroll.passive="scrolled">
            <BigTitle title="Timeline" :sub="`Plan ${target}`" />
            <template v-if="failed">
                <EmptyList icon="warn" title="The timeline did not load" :reason="failed" action="Try again" @act="load" />
            </template>
            <template v-else-if="!items">
                <CellGroup><Skeleton :count="4" /></CellGroup>
            </template>
            <template v-else-if="!items.length">
                <EmptyList icon="clock" title="Nothing yet" reason="Nothing has happened on this plan's to-dos yet." />
            </template>
            <template v-for="group in days" :key="group.day">
                <CellGroup :head="group.day">
                    <template v-for="item in group.items" :key="`${item.at}-${item.kind}-${item.todo}`">
                        <Cell
                            :label="`#${item.todo} ${item.title}`"
                            :sub="subOf(item)"
                            :icon="MOMENTS[item.kind].icon"
                            @pick="emit('open', `todo:${item.todo}`)"
                        />
                    </template>
                </CellGroup>
            </template>
        </div>
    </div>
</template>
