<script setup>
import {ref, watch} from "vue";

// what a worker's panel adds: each point of its brief with its proof
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}});
const points = ref([]);

async function load() {
    const answer = await props.read(["worker-worktree", "points", "--agent", String(props.id)]);
    points.value = answer.ok ? answer.value.points : [];
}

watch(() => props.id, load, {immediate: true});
</script>

<template>
    <section class="worker-facts" data-worker-facts>
        <template v-for="point in points" :key="point.id">
            <p class="worker-point" data-worker-point>
                <span class="worker-point-text">{{ point.id }}. {{ point.text }}</span>
                <span class="worker-proof">{{ point.proof ? `${point.proof.state}: ${point.proof.text}` : "No proof yet" }}</span>
            </p>
        </template>
        <template v-if="!points.length">
            <p class="worker-proof">Its brief has no points to prove.</p>
        </template>
    </section>
</template>

<style scoped>
.worker-facts {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 14px;
}

.worker-point {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    font-size: 13px;
}

.worker-proof {
    color: var(--text-3);
    font-size: 12px;
    overflow-wrap: anywhere;
}
</style>
