<script setup>
import {onMounted, ref} from "vue";
import {go, route} from "../route.js";
import ResourceEnd from "./ResourceEnd.vue";
import ResourceRow from "./ResourceRow.vue";
defineProps({groups: Array, type: String});
const settled = ref(false);
onMounted(() => setTimeout(() => (settled.value = true), 400));
</script>

<template>
    <TransitionGroup :name="settled ? 'group' : ''">
        <template v-for="g in groups" :key="g.key">
            <div class="group">
                <div class="ghead">
                    <span class="gtitle">{{ g.title }}</span>
                    <template v-if="g.count !== null">
                        <span class="gcount">{{ g.count === undefined ? g.list.length : g.count }}</span>
                    </template>
                </div>
                <template v-if="g.why">
                    <p class="group-why">{{ g.why }}</p>
                </template>
                <TransitionGroup tag="div" class="rows" :name="settled ? 'row' : ''">
                    <template v-for="(r, i) in g.list" :key="r.n">
                        <div class="row-wrap" :style="{'--i': i}">
                            <slot name="row" :resource="r">
                                <ResourceRow
                                    :resource="r"
                                    :selected="r.n === route.n && (g.env || route.env) === route.env"
                                    @click="go(g.env || route.env, type, r.n)"
                                />
                                <ResourceEnd :resource="r" />
                            </slot>
                        </div>
                    </template>
                </TransitionGroup>
            </div>
        </template>
    </TransitionGroup>
</template>

<style scoped>
.group {
    border-bottom: 1px solid var(--border);
}

.rows {
    position: relative;
}

.row-wrap {
    position: relative;
}

.row-wrap :deep(.resource-end) {
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
}

.row-wrap :deep(.row) {
    padding-right: 170px;
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
    background: color-mix(in srgb, var(--blocking) 16%, transparent);
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
    position: sticky;
    top: var(--sticky-top, 0);
    z-index: 1;
    display: flex;
    gap: 8px;
    padding: 10px 22px;
    background: var(--bg);
    color: var(--text-2);
    font-size: 13px;
}
.gcount {
    color: var(--text-3);
}
.group-why {
    margin: 0 22px 8px;
    color: var(--text-3);
    font-size: 12px;
}
</style>
