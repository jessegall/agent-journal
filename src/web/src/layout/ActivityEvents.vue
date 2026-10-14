<script setup>
import {store} from "../state/store.js";
import {counted, useActivity} from "../composables/activity.js";
import TextDisplay from "../kit/TextDisplay.vue";
import {onMounted, ref, toRef} from "vue";
import {peek} from "../route.js";
import {byRef} from "../domain/records.js";
import {age} from "../format/time.js";

const settled = ref(false);
onMounted(() => setTimeout(() => (settled.value = true), 400));
const {items, announced, tone, unfold, expanded, toggle, heading, title, who} = useActivity(toRef(store, "events"), byRef);
</script>

<template>
    <TransitionGroup tag="div" class="activity-list" :name="settled ? 'act' : ''">
        <template v-for="item in items" :key="item.key">
            <template v-if="item.fold">
                <button type="button" class="activity-row activity-fold" @click="unfold(item.key)">
                    <span class="activity-text">{{ counted(item.fold.events) }}</span>
                    <span class="activity-age">{{ age(item.fold.events[0].at) || "just now" }}</span>
                </button>
            </template>
            <template v-else>
                <div
                    :class="[
                        'activity-row',
                        'activity-link',
                        {'activity-update': announced(item.event), 'activity-nested': item.nested, 'activity-open': expanded(item.event)},
                        tone(item.event) && `tone-${tone(item.event)}`,
                    ]"
                    @click="toggle(item.event)"
                >
                    <span class="activity-text">
                        {{ heading(item.event) }}
                        <a class="activity-n" href="#" @click.prevent.stop="peek(item.event.type, item.event.n)">{{ item.event.n }}</a>
                    </span>
                    <template v-if="expanded(item.event) && title(item.event)">
                        <TextDisplay inline class="activity-title" :text="title(item.event)" />
                    </template>
                    <span class="activity-age">{{ who(item.event) }} · {{ age(item.event.at) || "just now" }}</span>
                </div>
            </template>
        </template>
    </TransitionGroup>
</template>

<style scoped>
.activity-fold {
    width: 100%;
    border: 0;
    background: none;
    text-align: left;
    font: inherit;
    cursor: pointer;
}

.activity-fold .activity-text {
    color: var(--text-3);
}

.activity-nested {
    padding-left: 18px;
}

.tone-warn,
.tone-good {
    border-left: 2px solid var(--tone);
}

.tone-warn {
    --tone: var(--tone-warn);
}

.tone-good {
    --tone: var(--tone-good);
}

.tone-warn .activity-text,
.tone-good .activity-text {
    color: var(--tone);
}

.activity-list {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 0 12px;
}

.activity-row {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 5px 8px;
}

.activity-text {
    font-size: 12px;
    color: var(--text-2);
    line-height: 1.45;
    overflow-wrap: anywhere;
}

.activity-title {
    font-size: 11.5px;
    color: var(--text-3);
    line-height: 1.4;
    overflow-wrap: anywhere;
}

.activity-age {
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
    opacity: 0.8;
}

.act-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.act-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.act-leave-active {
    position: absolute;
    left: 0;
    right: 0;
    transition: opacity 0.18s ease-in;
}

.act-leave-to {
    opacity: 0;
}

.act-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.activity-link {
    color: inherit;
    border-radius: 7px;
    cursor: pointer;
}

a.activity-n {
    color: inherit;
    text-decoration: none;
}

a.activity-n:hover {
    color: var(--accent-text);
    opacity: 1;
}

.activity-link:hover {
    background: var(--hover);
}

.activity-link:hover .activity-text {
    color: var(--text);
}

.activity-n {
    margin-left: 0.35em;
    font-size: 10.5px;
    color: var(--text-3);
    opacity: 0.65;
    font-variant-numeric: tabular-nums;
}

.activity-n::before {
    content: "·";
    margin-right: 0.35em;
}

.activity-update {
    margin: 2px 0;
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    box-shadow: inset 2px 0 0 var(--accent);
}
</style>
