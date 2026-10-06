<script setup>
import {computed, ref} from "vue";
import {api} from "../../api/client.js";
import {usePoll} from "../../composables/poll.js";
import {useToggledSet} from "../../composables/toggledSet.js";
import {SIZES, familyCounts, familyTree, nodeLook} from "../../domain/family.js";
import {counted} from "../../format/number.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";

const EVERY = 5000;

const emit = defineEmits(["open"]);
const family = ref(null);
const {members: unfolded, toggle} = useToggledSet();
usePoll(
    "phone-family",
    () => api.family(),
    EVERY,
    (got) => (family.value = got || {members: [], links: []})
);

const nodes = computed(() => (family.value ? familyTree(family.value, unfolded.value, SIZES.compact).nodes : []));
const line = computed(() => {
    if (!family.value) return "";
    const counts = familyCounts(family.value);
    return `${counted(counts.agents, "agent")} and ${counted(counts.subagents, "subagent")}, ${counts.live} working now. Who started whom.`;
});
const opens = (node) => Boolean(node.fold || (node.member.n && node.member.kind !== "subagent"));
const subOf = (look) => [look.note, look.badge ? counted(Number(look.badge), "repeating prompt") : ""].filter(Boolean).join(" · ");

function pick(node) {
    if (node.fold) return toggle(node.fold.fold);
    if (opens(node)) emit("open", `agent:${node.member.n}`);
}
</script>

<template>
    <template v-if="nodes.length">
        <CellGroup head="Family tree" :line="line">
            <template v-for="node in nodes" :key="node.id">
                <Cell
                    :label="nodeLook(node).label"
                    :sub="subOf(nodeLook(node))"
                    :icon="nodeLook(node).icon"
                    :indent="node.level"
                    :still="!opens(node)"
                    :chevron="!node.fold"
                    :class="['family-node', {faded: nodeLook(node).faded}]"
                    @pick="pick(node)"
                >
                    <template #lead>
                        <template v-if="nodeLook(node).state">
                            <span
                                :class="['family-dot', nodeLook(node).state]"
                                :aria-label="nodeLook(node).live ? 'Working' : 'Not working'"
                            />
                        </template>
                    </template>
                </Cell>
            </template>
        </CellGroup>
    </template>
</template>

<style scoped>
.family-dot {
    flex: none;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--border-2);
}

.family-dot.running {
    background: var(--accent);
}

.family-dot.done {
    background: var(--tone-good);
}

.family-node.faded {
    opacity: 0.6;
}
</style>
