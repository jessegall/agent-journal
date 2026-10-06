<script setup>
import {computed} from "vue";
import ItemRow from "./kit/ItemRow.vue";

const props = defineProps({card: {type: Object, required: true}, still: {type: Boolean, default: false}});
const emit = defineEmits(["open", "more", "done", "shift"]);
const DOTS = {doing: "doing", held: "blocked", asked: "waiting", done: "done"};
const can = (lane) => props.card.targets.includes(lane);
const meta = computed(() => [`#${props.card.n}`, props.card.reason, props.card.assigned].filter(Boolean));
const lead = computed(() => (props.still || props.card.lane === "done" ? null : {label: "Mark done", run: () => emit("done")}));
const trail = computed(() => {
    if (props.still || props.card.lane === "done") return [];
    const moves = [
        can("doing") && {key: "start", label: "Start", tone: "start", run: () => emit("shift", "doing")},
        props.card.lane === "held" && can("todo") && {key: "unblock", label: "Unblock", tone: "start", run: () => emit("shift", "todo")},
        can("held") && {key: "block", label: "Block", tone: "block", run: () => emit("shift", "held")},
    ];
    return [...moves.filter(Boolean), {key: "more", label: "More", tone: "", run: () => emit("more")}];
});
</script>

<template>
    <ItemRow
        :title="card.title"
        :about="`To-do ${card.n}`"
        :meta="meta"
        :state="DOTS[card.lane] || ''"
        :lead="lead"
        :trail="trail"
        @open="emit('open')"
        @more="emit('more')"
    />
</template>
