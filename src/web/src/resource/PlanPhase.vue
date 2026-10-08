<script setup>
import {computed, inject} from "vue";
import Dot from "../kit/Dot.vue";
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";
import {state} from "../domain/records.js";
import HolderTag from "../kit/HolderTag.vue";
import {HELPER_WORDS, helperHolding, helperName, helperState, helpersHolding} from "../domain/helpers.js";
import {peek, peekThere} from "../route.js";

const props = defineProps({
    phase: {type: Object, default: null},
    current: {type: Boolean, default: false},
    boning: {type: Boolean, default: false},
    skeleton: {type: Boolean, default: false},
    helpers: {type: Array, default: () => []},
});
const emit = defineEmits(["inspect"]);
const talk = inject("talk", null);
const scope = useScope();
const open = (row) => (scope.env ? peekThere(scope.env, row.type, row.n) : peek(row.type, row.n));
const rows = computed(() => props.phase?.rows || []);
const done = computed(() => rows.value.length > 0 && rows.value.every((t) => t.completed));
const closed = computed(() => rows.value.filter((t) => t.completed).length);
const holders = computed(() => helpersHolding(rows.value, props.helpers));
const heldBy = (todo) => helperHolding(todo, props.helpers);
const bones = computed(() => (props.boning ? Math.max(0, 3 - rows.value.length) : 0));
</script>

<template>
    <template v-if="skeleton">
        <li class="phase skeleton" aria-hidden="true">
            <div class="phead">
                <span class="mark"><Icon name="circle" :size="14" /></span>
                <span class="ptitle bone" />
            </div>
        </li>
    </template>
    <template v-else>
        <li :class="['phase', {current, done}]">
            <div class="phead">
                <span class="mark"><Icon :name="done ? 'check' : 'circle'" :size="14" /></span>
                <span class="ptitle">{{ phase.i }}. {{ phase.title }}</span>
                <template v-if="phase.checkpoint">
                    <span class="cp">checkpoint</span>
                </template>
                <template v-for="h in holders" :key="h.n">
                    <HolderTag :name="helperName(h)" :state="helperState(h)" :word="HELPER_WORDS[helperState(h)]" @open="emit('inspect', h)" />
                </template>
                <span class="progress">{{ closed }}/{{ rows.length }}</span>
                <template v-if="talk">
                    <button type="button" class="say" title="Comment on this phase" @click="talk.say(`Phase ${phase.i}: ${phase.title}`)">
                        <Icon name="bubble" :size="12" />
                    </button>
                </template>
            </div>
            <template v-if="phase.when">
                <div class="when">complete when {{ phase.when }}</div>
            </template>
            <template v-for="t in rows" :key="`${t.type}-${t.n}`">
                <div class="line">
                    <button type="button" :class="['row', {completed: t.completed}]" @click="open(t)">
                        <template v-if="t.type === 'ticket'">
                            <Icon class="ticket-mark" name="ticket" :size="12" />
                        </template>
                        <template v-else>
                            <Dot :kind="state(t)" />
                        </template>
                        <span class="rn">#{{ t.n }}</span>
                        <span class="rt">{{ t.title }}</span>
                    </button>
                    <template v-if="heldBy(t)">
                        <HolderTag
                            :name="helperName(heldBy(t))"
                            :state="helperState(heldBy(t))"
                            :word="HELPER_WORDS[helperState(heldBy(t))]"
                            @open="emit('inspect', heldBy(t))"
                        />
                    </template>
                    <template v-if="talk">
                        <button type="button" class="say" title="Comment on this to-do" @click="talk.say(`#${t.n} ${t.title}`)">
                            <Icon name="bubble" :size="12" />
                        </button>
                    </template>
                </div>
            </template>
            <template v-for="j in bones" :key="`row-bone-${j}`">
                <div class="line bones" aria-hidden="true"><span class="bone row-bone" /></div>
            </template>
        </li>
    </template>
</template>

<style scoped>
.phase.skeleton {
    opacity: 0.4;
    pointer-events: none;
}

.bone {
    display: block;
    height: 11px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--border) 25%, var(--border-2) 37%, var(--border) 63%);
    background-size: 400% 100%;
    animation: bone 1.4s ease infinite;
}

.ptitle.bone {
    width: 42%;
}

.line.bones {
    height: 26px;
}

.row-bone {
    width: 58%;
    margin-left: 22px;
}

.line.bones:nth-child(odd) .row-bone {
    width: 44%;
}

@keyframes bone {
    from {
        background-position: 100% 50%;
    }

    to {
        background-position: 0 50%;
    }
}

.phase {
    padding: 10px 14px;
    margin-bottom: 8px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.phase.current {
    border-color: var(--accent);
}

.phase.done {
    opacity: 0.7;
}

.phead {
    display: flex;
    align-items: center;
    gap: 10px;
}

.mark {
    color: var(--accent-text);
    display: inline-flex;
}

.ptitle {
    flex: 1;
    font-weight: 500;
}

.cp {
    color: var(--blocking);
    font-size: 11.5px;
}

.progress {
    color: var(--text-3);
    font-size: 12px;
}

.when {
    margin: 2px 0 6px 24px;
    color: var(--text-3);
    font-size: 12.5px;
}

.line {
    display: flex;
    align-items: center;
}

.line .row {
    flex: 1;
    min-width: 0;
}

.say {
    flex: none;
    display: inline-flex;
    padding: 3px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    opacity: 0;
    cursor: pointer;
}

.line:hover .say,
.phead:hover .say,
.say:focus-visible {
    opacity: 1;
}

.say:hover {
    color: var(--accent-text);
}

.row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 4px 0 4px 24px;
    border: 0;
    background: none;
    color: var(--text-2);
    text-align: left;
    cursor: pointer;
}

.row:hover {
    color: var(--text);
}

.row.completed .rt {
    text-decoration: line-through;
    color: var(--text-3);
}

.rn {
    color: var(--text-3);
    font-size: 12px;
}
</style>
