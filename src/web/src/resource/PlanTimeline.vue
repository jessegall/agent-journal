<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";

const props = defineProps({items: {type: Array, default: () => []}});
const emit = defineEmits(["open"]);
const KINDS = {
    started: {icon: "play", word: "Started"},
    log: {icon: "pencil", word: "Logged"},
    ended: {icon: "flag", word: "Work ended"},
    done: {icon: "tick", word: "Done"},
};
const dayOf = (at) => new Date(at * 1000).toLocaleDateString(undefined, {weekday: "short", day: "numeric", month: "short"});
const timeOf = (at) => new Date(at * 1000).toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"});
const days = computed(() => {
    const grouped = [];
    for (const item of [...props.items].reverse()) {
        const day = dayOf(item.at);
        if (grouped.at(-1)?.day !== day) grouped.push({day, items: []});
        grouped.at(-1).items.push(item);
    }
    return grouped;
});
</script>

<template>
    <section class="timeline" aria-label="Timeline">
        <template v-if="!items.length">
            <p class="empty">Nothing has happened on this plan's to-dos yet.</p>
        </template>
        <template v-for="group in days" :key="group.day">
            <h3 class="day">{{ group.day }}</h3>
            <ol class="moments">
                <template v-for="item in group.items" :key="`${item.at}-${item.kind}-${item.todo}`">
                    <li :class="['moment', item.kind]">
                        <span class="mark"><Icon :name="KINDS[item.kind].icon" :size="11" /></span>
                        <div class="what">
                            <div class="head">
                                <span class="word">{{ KINDS[item.kind].word }}</span>
                                <button type="button" class="todo" :title="`Open to-do ${item.todo}`" @click="emit('open', item.todo)">
                                    #{{ item.todo }} {{ item.title }}
                                </button>
                                <span class="at">{{ timeOf(item.at) }}</span>
                            </div>
                            <template v-if="item.text && item.kind !== 'started'">
                                <TextDisplay class="text" :text="item.text" />
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
}

.empty {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.day {
    margin: 10px 0 2px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.moments {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
}

.moment {
    position: relative;
    display: flex;
    gap: 10px;
    padding-bottom: 12px;
}

.moment::before {
    content: "";
    position: absolute;
    top: 20px;
    bottom: 0;
    left: 9px;
    width: 1px;
    background: var(--border);
}

.moment:last-child::before {
    display: none;
}

.mark {
    flex: none;
    display: grid;
    place-items: center;
    width: 19px;
    height: 19px;
    border: 1px solid var(--border-2);
    border-radius: 50%;
    background: var(--raised);
    color: var(--text-3);
}

.moment.done .mark {
    border-color: var(--progress);
    color: var(--progress);
}

.what {
    flex: 1;
    min-width: 0;
}

.head {
    display: flex;
    align-items: baseline;
    gap: 6px;
    min-width: 0;
    font-size: 12.5px;
}

.word {
    flex: none;
    color: var(--text-3);
}

.todo {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.todo:hover {
    color: var(--accent-text);
}

.at {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
}

.text {
    margin-top: 3px;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.5;
}
</style>
