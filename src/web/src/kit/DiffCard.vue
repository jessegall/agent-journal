<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import Icon from "./Icon.vue";

const props = defineProps({
    path: {type: String, required: true},
    kind: {type: String, required: true},
    added: {type: Number, required: true},
    removed: {type: Number, required: true},
    ago: {type: String, required: true},
    rows: {type: Array, required: true},
    flush: Boolean,
    half: Boolean,
    folded: Boolean,
    editsOnly: Boolean,
    hideRemovals: Boolean,
    capped: Boolean,
    lines: {type: Number, default: 0},
    whole: {type: Object, default: null},
    entering: Boolean,
    fresh: {type: String, default: ""},
});

const emit = defineEmits(["fold", "whole"]);
const BADGES = {new: "created", deleted: "deleted"};
const SIGNS = {add: "+", del: "−"};

const cut = computed(() => props.path.lastIndexOf("/") + 1);
const dir = computed(() => props.path.slice(0, cut.value));
const name = computed(() => props.path.slice(cut.value));
const gone = computed(() => props.kind === "deleted");
const badge = computed(() => BADGES[props.kind]);

const changed = computed(() => new Set(props.rows.filter((row) => row.kind === "add").map((row) => row.line)));
const drawn = computed(() => {
    if (props.whole && props.whole.text !== undefined)
        return props.whole.text.split("\n").map((text, i) => ({kind: changed.value.has(i + 1) ? "add" : "ctx", line: i + 1, text}));
    return props.rows.filter(
        (row) => !(props.editsOnly && ["ctx", "fold"].includes(row.kind)) && !(props.hideRemovals && row.kind === "del")
    );
});

const opened = ref(false);
const limited = computed(() => props.lines && !opened.value && !props.whole);
const listed = computed(() => (limited.value ? drawn.value.slice(0, props.lines) : drawn.value));
const beyond = computed(() => drawn.value.length - listed.value.length);

const numberOf = (row) => (row.line === null || row.kind === "del" ? "" : row.line);
const textOf = (row) => (row.kind === "fold" ? (row.hidden ? `⋯ ${row.hidden} lines` : "⋯") : row.text);

const grow = ref(null);
const body = ref(null);
let sized = null;

onMounted(() => {
    if (!body.value) return;
    let first = true;
    sized = new ResizeObserver(() => {
        if (!grow.value || !body.value) return;
        grow.value.style.transition = first ? "none" : "";
        grow.value.style.height = `${body.value.offsetHeight}px`;
        first = false;
    });
    sized.observe(body.value);
});

onUnmounted(() => sized && sized.disconnect());
</script>

<template>
    <section :class="['diff-card', {half, gone, entering, flush, folded, capped}]">
        <header class="diff-card-head" :title="gone ? null : folded ? 'Show the changes' : 'Fold this card'" @click="!gone && emit('fold')">
            <span class="diff-card-path" :title="path">
                <span class="diff-card-dir">{{ dir }}</span>
                <span class="diff-card-name">{{ name }}</span>
                <template v-if="badge">
                    <span :class="['diff-card-badge', kind]">{{ badge }}</span>
                </template>
            </span>
            <span :class="['diff-card-count', 'add', {zero: !added}]">+{{ added }}</span>
            <span :class="['diff-card-count', 'del', {zero: !removed}]">−{{ removed }}</span>
            <span class="diff-card-ago">{{ ago }}</span>
            <template v-if="!gone">
                <button
                    type="button"
                    :class="['diff-card-whole', {on: whole}]"
                    :title="whole ? 'Show only the changes' : 'Show the whole file'"
                    @click.stop="emit('whole')"
                >
                    <Icon name="file" :size="12" />
                </button>
            </template>
        </header>
        <template v-if="whole && whole.error">
            <p class="diff-card-note">{{ whole.error }}</p>
        </template>
        <template v-if="!gone && !folded">
            <div ref="grow" class="diff-card-grow">
                <div ref="body" class="diff-card-diff">
                    <div class="diff-card-rows">
                        <template v-for="(row, i) in listed" :key="i">
                            <div :class="['diff-row', row.kind, {fresh: fresh && row.edit === fresh}]">
                                <span class="diff-row-num">{{ numberOf(row) }}</span>
                                <span class="diff-row-sign">{{ SIGNS[row.kind] }}</span>
                                <span class="diff-row-code">{{ textOf(row) }}</span>
                            </div>
                        </template>
                        <template v-if="beyond > 0">
                            <button type="button" class="diff-card-more" @click.stop="opened = true">
                                {{ beyond }} more {{ beyond === 1 ? "line" : "lines" }}
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </section>
</template>

<style scoped>
.diff-card {
    width: 100%;
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--raised);
    transition: width 0.4s var(--ease);
}

.diff-card.half {
    width: calc(50% - 5px);
}

.diff-card.flush {
    width: 100%;
    border-width: 0 0 1px;
    border-radius: 0;
}

.diff-card.entering {
    animation: diff-card-rise 0.45s var(--ease) both;
}

@container (max-width: 600px) {
    .diff-card.half {
        width: 100%;
    }
}

.diff-card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 34px;
    padding: 0 12px;
    border-bottom: 1px solid var(--border);
    font-family: var(--mono);
    font-size: 12px;
}

.diff-card.gone .diff-card-head {
    border-bottom: 0;
}

.diff-card-path {
    display: flex;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
}

.diff-card-dir {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-4);
    text-overflow: ellipsis;
}

.diff-card-name {
    flex: none;
    color: var(--text);
}

.diff-card.gone .diff-card-name {
    color: var(--text-3);
    text-decoration: line-through;
    text-decoration-color: var(--text-4);
}

.diff-card-more {
    display: block;
    width: 100%;
    padding: 4px 12px;
    border: 0;
    background: none;
    color: var(--text-4);
    font-family: var(--font);
    font-size: 11.5px;
    text-align: left;
    cursor: pointer;
}

.diff-card-more:hover {
    color: var(--text-2);
}

.diff-card-badge {
    flex: none;
    margin-left: 7px;
    color: var(--text-4);
    font-family: var(--font);
    font-size: 8.5px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
}

.diff-card-badge.new {
    color: var(--add-fg);
}

.diff-card-badge.deleted {
    color: var(--del-fg);
}

.diff-card-count {
    min-width: 4.5ch;
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
    text-align: right;
    white-space: nowrap;
}

.diff-card-count.add {
    color: var(--add-fg);
}

.diff-card-count.del {
    color: var(--del-fg);
}

.diff-card-count.zero {
    color: var(--text-4);
}

.diff-card-ago {
    width: 30px;
    color: var(--text-4);
    font-family: var(--font);
    font-size: 11.5px;
    text-align: right;
    white-space: nowrap;
}

.diff-card-grow {
    overflow: hidden;
    transition: height 0.4s var(--ease);
}

.diff-card.capped .diff-card-diff {
    max-height: 360px;
    overflow-y: auto;
}

.diff-card-whole {
    display: grid;
    place-items: center;
    width: 22px;
    height: 20px;
    margin-left: 2px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-4);
    cursor: pointer;
}

.diff-card-whole:hover,
.diff-card-whole.on {
    background: var(--hover);
    color: var(--text);
}

.diff-card-note {
    margin: 0;
    padding: 8px 12px;
    color: var(--text-3);
    font-size: 12px;
}

.diff-card:not(.gone) .diff-card-head {
    cursor: pointer;
}

.diff-card-diff {
    overflow-x: auto;
    padding: 4px 0;
    scrollbar-width: thin;
    scrollbar-color: var(--border-3) transparent;
}

.diff-card-rows {
    width: max-content;
    min-width: 100%;
}

.diff-row {
    display: grid;
    grid-template-columns: 40px 16px auto;
    height: var(--diff-line, 19px);
    font-family: var(--mono);
    font-size: var(--diff-size, 11.5px);
    line-height: var(--diff-line, 19px);
}

.diff-row-num {
    padding-right: 8px;
    color: var(--text-4);
    text-align: right;
    user-select: none;
}

.diff-row-sign {
    text-align: center;
    user-select: none;
}

.diff-row-code {
    padding-right: 14px;
    color: var(--text-3);
    white-space: pre;
}

.diff-row.add {
    background: var(--add-bg);
}

.diff-row.add .diff-row-num,
.diff-row.add .diff-row-sign {
    color: var(--add-fg);
}

.diff-row.add .diff-row-code {
    color: var(--text);
}

.diff-row.del {
    background: var(--del-bg);
}

.diff-row.del .diff-row-num,
.diff-row.del .diff-row-sign {
    color: var(--del-fg);
}

.diff-row.del .diff-row-code {
    color: var(--text-2);
}

.diff-row.fold {
    background: rgba(255, 255, 255, 0.025);
}

.diff-row.fold .diff-row-code {
    color: var(--text-4);
    font-family: var(--font);
}

.diff-row.fresh {
    animation: diff-row-in 0.5s ease-out both;
}

@keyframes diff-card-rise {
    from {
        opacity: 0;
        transform: translateY(6px);
    }
}

@keyframes diff-row-in {
    from {
        opacity: 0;
    }
}
</style>
