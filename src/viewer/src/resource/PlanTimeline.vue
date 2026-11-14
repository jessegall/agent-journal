<script setup>
import {computed, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import TaskStatusIcon from "../tasks/TaskStatusIcon.vue";
import Skeleton from "../kit/Skeleton.vue";
import TextDisplay from "../kit/TextDisplay.vue";

// what happened on a plan's tasks, newest first, by day
const EVENT_TYPES = {
    made: {state: "open", word: "Made"},
    logged: {icon: "edits", word: "Logged"},
    completed: {state: "completed", word: "Finished"},
    cancelled: {state: "cancelled", word: "Cancelled"},
};
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}});
const emit = defineEmits(["select"]);
const events = ref(null);
const failure = ref("");

const days = computed(() => {
    const groups = new Map();
    for (const event of events.value ?? []) {
        const day = new Date(event.time).toLocaleDateString(undefined, {weekday: "long", month: "long", day: "numeric"});
        groups.set(day, [...(groups.get(day) ?? []), event]);
    }
    return [...groups].map(([day, items]) => ({day, items}));
});
const clock = (time) => new Date(time).toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"});

async function load() {
    const answer = await props.read(["plan", "timeline", String(props.id)]);
    failure.value = answer.ok ? "" : answer.error;
    events.value = answer.ok ? answer.value.events : [];
}

watch(() => props.id, load, {immediate: true});
</script>

<template>
    <section class="timeline" aria-label="Timeline" data-plan-timeline>
        <template v-if="failure">
            <p class="empty" role="alert">{{ failure }}</p>
        </template>
        <template v-else-if="events === null">
            <Skeleton />
        </template>
        <template v-else-if="!events.length">
            <p class="empty">Nothing has happened on this plan's tasks yet.</p>
        </template>
        <template v-for="group in days" :key="group.day">
            <h3 class="day">{{ group.day }}</h3>
            <ol class="events">
                <template v-for="event in group.items" :key="`${event.time}-${event.event_type}-${event.task_id}`">
                    <li :class="['event', event.event_type]" data-plan-event>
                        <span class="mark">
                            <template v-if="EVENT_TYPES[event.event_type].state">
                                <TaskStatusIcon :status="EVENT_TYPES[event.event_type].state" />
                            </template>
                            <template v-else>
                                <Icon :name="EVENT_TYPES[event.event_type].icon" :size="14" />
                            </template>
                        </span>
                        <div class="what">
                            <div class="head">
                                <span class="word">{{ EVENT_TYPES[event.event_type].word }}</span>
                                <button type="button" class="task" :title="`Open task ${event.task_id}`" @click="emit('select', event.task_id)">#{{ event.task_id }} {{ event.title }}</button>
                                <span class="at">{{ clock(event.time) }}</span>
                            </div>
                            <template v-if="event.text">
                                <TextDisplay class="text" :text="event.text" />
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
    padding: 0 16px;
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

.events {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
}

.event {
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
    color: var(--text-3);
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
