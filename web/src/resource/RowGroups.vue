<script setup>
import {onMounted, ref} from "vue";
import {go, route} from "../route.js";
import ResourceRow from "./ResourceRow.vue";
defineProps({groups: Array, type: String});
const settled = ref(false);
onMounted(() => setTimeout(() => (settled.value = true), 400));
</script>

<template>
    <TransitionGroup :name="settled ? 'group' : ''">
        <div v-for="g in groups" :key="g.key" class="group">
            <div class="ghead">
                <span class="gtitle">{{ g.title }}</span>
                <span class="gcount">{{ g.list.length }}</span>
            </div>
            <TransitionGroup tag="div" class="rows" :name="settled ? 'row' : ''">
                <ResourceRow
                    v-for="(r, i) in g.list"
                    :key="r.n"
                    :resource="r"
                    :selected="r.n === route.n"
                    :style="{'--i': i}"
                    @click="go(route.env, type, r.n)"
                />
            </TransitionGroup>
        </div>
    </TransitionGroup>
</template>

<style scoped>
.group {
    border-bottom: 1px solid var(--border);
}

.rows {
    position: relative;
}

@keyframes row-arrived {
    from {
        background: color-mix(in srgb, var(--accent) 20%, transparent);
    }

    to {
        background: transparent;
    }
}

.row-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    animation: row-arrived 0.9s ease-out both;
    animation-delay: calc(min(var(--i, 0), 10) * 22ms);
}

.row-leave-active {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 0;
    background: color-mix(in srgb, #c9955e 16%, transparent);
    transition:
        opacity 0.18s ease-in,
        transform 0.18s ease-in;
}

.row-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.row-enter-from {
    opacity: 0;
    transform: translateY(6px);
}

.row-leave-to {
    opacity: 0;
    transform: scale(0.98);
}

.group-enter-active {
    transition: opacity 0.22s ease-out;
}

.group-leave-active {
    transition: opacity 0.18s ease-in;
}

.group-enter-from,
.group-leave-to {
    opacity: 0;
}

.group-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ghead {
    display: flex;
    gap: 8px;
    padding: 10px 22px;
    color: var(--text-2);
    font-size: 13px;
}
.gcount {
    color: var(--text-3);
}
</style>
