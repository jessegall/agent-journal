<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import {clock} from "../format/time.js";
import {peekRef, route} from "../route.js";
import {rows} from "../sync/rows.js";
import {
    carriedOver,
    commitHref,
    neighbour,
    refLabel,
    updateAlso,
    updateCounts,
    updateLabel,
    updateSections,
    updateSpan,
} from "../domain/updates.js";

const props = defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["step", "all"]);
const reports = computed(() => rows("report"));
const newer = computed(() => neighbour(props.resource, reports.value, 1));
const older = computed(() => neighbour(props.resource, reports.value, -1));
const carried = computed(() => carriedOver(props.resource, reports.value));
const counts = computed(() => updateCounts(props.resource, !!newer.value));
const sections = computed(() => updateSections(props.resource, !!newer.value));
const also = computed(() => updateAlso(props.resource));

function open(item) {
    const href = commitHref(item.ref, route.value.env);
    if (href) location.hash = href;
    else peekRef(item.ref);
}
</script>

<template>
    <section class="update">
        <div class="update-nav hy">
            <template v-if="older">
                <Btn small @click="emit('step', older.n)">‹ {{ updateLabel(older) }}</Btn>
            </template>
            <template v-if="newer">
                <Btn small @click="emit('step', newer.n)">{{ updateLabel(newer) }} ›</Btn>
            </template>
            <Btn small @click="emit('all')">All updates</Btn>
        </div>
        <p class="update-facts hy">
            <template v-for="c in counts" :key="c.label">
                <span>
                    <span class="update-num" :data-to="c.n">{{ c.n }}</span>
                    {{ c.label }}
                </span>
                <span class="update-dot">·</span>
            </template>
            <span>{{ updateSpan(resource) }}</span>
        </p>
        <template v-for="s in sections" :key="s.key">
            <div class="update-section">
                <h3 class="update-head hy" data-hy="head">
                    {{ s.title }}
                    <span class="update-count">{{ s.items.length }}</span>
                </h3>
                <div class="update-list">
                    <template v-for="item in s.items" :key="item.ref">
                        <button
                            type="button"
                            :class="['update-row', 'hy', {commit: s.key === 'commits'}]"
                            data-hy="row"
                            :data-changed="carried.has(item.ref) ? null : '1'"
                            @click="open(item)"
                        >
                            <template v-if="s.key === 'commits'">
                                <span class="update-sha">{{ refLabel(item.ref) }}</span>
                                <span class="update-subject">{{ item.title }}</span>
                            </template>
                            <template v-else>
                                <span class="update-title">{{ item.title }}</span>
                                <span class="update-ref">{{ refLabel(item.ref) }}</span>
                                <template v-if="item.note">
                                    <span class="update-note">{{ item.note }}</span>
                                </template>
                            </template>
                        </button>
                    </template>
                </div>
            </div>
        </template>
        <template v-if="also.length">
            <p class="update-also hy">
                <span>Also changed:</span>
                <template v-for="(item, i) in also" :key="item.ref">
                    <template v-if="i">
                        <span class="update-dot">·</span>
                    </template>
                    <button type="button" class="update-also-ref" :title="item.title" @click="open(item)">{{ refLabel(item.ref) }}</button>
                </template>
            </p>
        </template>
        <p class="update-foot hy">Written by the agent at {{ clock(resource.created) }}</p>
    </section>
</template>

<style scoped>
.update {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 4px;
}

.update-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.update-facts,
.update-also {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0 6px;
    margin: 0;
    color: var(--text-4);
    font-size: 11.5px;
    line-height: 1.45;
}

.update-num {
    font-variant-numeric: tabular-nums;
}

.update-head {
    display: flex;
    gap: 8px;
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.update-count {
    color: var(--text-4);
    font-weight: 400;
}

.update-list {
    display: flex;
    flex-direction: column;
    margin: 0 -12px;
}

.update-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: baseline;
    column-gap: 16px;
    padding: 9px 12px;
    border: 0;
    border-top: 1px solid var(--border);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.12s;
}

.update-row:last-child {
    border-bottom: 1px solid var(--border);
}

.update-row:hover {
    background: var(--hover);
}

.update-row.commit {
    grid-template-columns: 64px minmax(0, 1fr);
    padding-top: 7px;
    padding-bottom: 7px;
}

.update-title {
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.45;
    text-wrap: pretty;
}

.update-ref {
    color: var(--text-3);
    font-size: 11.5px;
    white-space: nowrap;
}

.update-row:hover .update-ref,
.update-also-ref:hover {
    color: var(--accent-text);
}

.update-note {
    grid-column: 1;
    margin-top: 1px;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.45;
    text-wrap: pretty;
}

.update-sha {
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 11.5px;
}

.update-subject {
    overflow: hidden;
    color: var(--text-2);
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.update-also-ref {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    cursor: pointer;
}

.update-foot {
    margin: 0;
    color: var(--text-4);
    font-size: 11.5px;
}

@media (max-width: 760px) {
    .update-row {
        padding-top: 11px;
        padding-bottom: 11px;
    }
}
</style>
