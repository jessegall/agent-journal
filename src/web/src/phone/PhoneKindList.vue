<script setup>
import {computed, ref} from "vue";
import {kindOf} from "./kinds.js";
import ActionSheet from "./kit/ActionSheet.vue";
import ItemRow from "./kit/ItemRow.vue";
import ListScreen from "./kit/ListScreen.vue";
import {newestFirst} from "./kit/listed.js";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const kind = computed(() => kindOf(props.target));
const acting = ref(null);
const empty = computed(() => ({
    icon: kind.value.icon,
    title: `No open ${kind.value.many.toLowerCase()}`,
    reason: `${kind.value.intro} None are open here right now.`,
    action: "",
}));

const load = newestFirst(props.target);
const refOf = (row) => `${props.target}:${row.n}`;
const about = (row) => `${kind.value.one} ${row.n}`;
const meta = (row) => [about(row), row.completed ? "Closed" : ""].filter(Boolean);
const actions = (row) => [{key: "open", label: "Open", run: () => emit("open", refOf(row))}];
</script>

<template>
    <ListScreen :title="kind.many" :intro="kind.intro" :back="back" :load="load" :empty="empty" @back="emit('back')">
        <template #row="{row}">
            <ItemRow
                :title="row.title"
                :about="about(row)"
                :meta="meta(row)"
                :state="row.completed ? 'done' : ''"
                @open="emit('open', refOf(row))"
                @more="acting = row"
            />
        </template>
    </ListScreen>
    <template v-if="acting">
        <ActionSheet :title="acting.title" :about="about(acting)" :actions="actions(acting)" @close="acting = null" />
    </template>
</template>
