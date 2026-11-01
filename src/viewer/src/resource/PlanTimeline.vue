<script setup>
import {computed, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import Skeleton from "../kit/Skeleton.vue";
import TextDisplay from "../kit/TextDisplay.vue";

// what happened on a plan's tasks, newest first, by day
const KINDS = {
    made: {icon: "plus", word: "Made"},
    logged: {icon: "edits", word: "Logged"},
    completed: {icon: "check", word: "Finished"},
    cancelled: {icon: "close", word: "Cancelled"},
};
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}});
const emit = defineEmits(["select"]);
const moments = ref(null);
const failure = ref("");

const days = computed(() => {
    const groups = new Map();
    for (const moment of moments.value ?? []) {
        const day = new Date(moment.time).toLocaleDateString(undefined, {weekday: "long", month: "long", day: "numeric"});
        groups.set(day, [...(groups.get(day) ?? []), moment]);
    }
    return [...groups].map(([day, items]) => ({day, items}));
});
const clock = (time) => new Date(time).toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"});

async function load() {
    const answer = await props.read(["plan", "timeline", String(props.id)]);
    failure.value = answer.ok ? "" : answer.error;
    moments.value = answer.ok ? answer.value.moments : [];
}

watch(() => props.id, load, {immediate: true});
</script>

<template>
    <section class="timeline" aria-label="Timeline" data-plan-timeline>
        <template v-if="failure">
            <p class="empty" role="alert">{{ failure }}</p>
        </template>
        <template v-else-if="moments === null">
            <Skeleton />
        </template>
        <template v-else-if="!moments.length">
            <p class="empty">Nothing has happened on this plan's tasks yet.</p>
        </template>
        <template v-for="group in days" :key="group.day">
            <h3 class="day">{{ group.day }}</h3>
            <ol class="moments">
                <template v-for="moment in group.items" :key="`${moment.time}-${moment.kind}-${moment.task_id}`">
                    <li :class="['moment', moment.kind]" data-plan-moment>
                        <span class="mark"><Icon :name="KINDS[moment.kind].icon" :size="11" /></span>
                        <div class="what">
                            <div class="head">
                                <span class="word">{{ KINDS[moment.kind].word }}</span>
                                <button type="button" class="task" :title="`Open task ${moment.task_id}`" @click="emit('select', moment.task_id)">#{{ moment.task_id }} {{ moment.title }}</button>
                                <span class="at">{{ clock(moment.time) }}</span>
                            </div>
                            <template v-if="moment.text">
                                <TextDisplay class="text" :text="moment.text" />
                            </template>
                        </div>
                    </li>
                </template>
            </ol>
        </template>
    </section>
</template>

<style scoped>
.timeline {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 14px;
}

.empty {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.day {
    margin: 10px 0 2px;
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 600;
}

.moments {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
}

.moment {
    display: flex;
    gap: 10px;
    padding-bottom: 12px;
}

.mark {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 20px;
    height: 20px;
    border: 1px solid var(--border-2);
    border-radius: 50%;
    background: var(--bg);
    color: var(--text-3);
}

.moment.completed .mark {
    color: var(--tone-good);
}

.what {
    flex: 1;
    min-width: 0;
}

.head {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: baseline;
    font-size: 13px;
}

.word {
    color: var(--text-2);
}

.task {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.task:hover {
    text-decoration: underline;
}

.at {
    margin-left: auto;
    color: var(--text-3);
    font-size: 11.5px;
}

.text {
    margin-top: 2px;
    color: var(--text-2);
    font-size: 13px;
}
</style>
