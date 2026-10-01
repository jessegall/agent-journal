<script setup>
import {nextTick, ref, watch} from "vue";
import WorkingDots from "../kit/WorkingDots.vue";
import {useNow} from "../composables/now.js";
import {age} from "../format/time.js";
import {store} from "../state/store.js";

const props = defineProps({
    timeline: {type: Array, required: true},
    current: {type: Object, default: null},
    thinking: {type: String, default: ""},
});
const box = ref(null);
const now = useNow(3000);
const ageOf = (at) => (now.value, age(at));

watch(
    () => [store.dumpShown, props.timeline.length, props.thinking],
    async () => {
        await nextTick();
        if (box.value) box.value.scrollTop = box.value.scrollHeight;
    },
    {immediate: true}
);
</script>

<template>
    <div ref="box" class="dump-narr">
        <template v-for="line in timeline" :key="line.key">
            <div :class="['dump-line', {mine: line.mine, now: line === current}]">
                <template v-if="line.mine">{{ line.text }}</template>
                <template v-else>
                    <span class="dump-line-head">
                        <span class="dump-line-title">{{ line.text }}</span>
                        <template v-if="line === current">
                            <WorkingDots />
                        </template>
                        <span class="dump-line-age">{{ ageOf(line.at) }}</span>
                    </span>
                    <template v-if="line.detail">
                        <span class="dump-line-detail">{{ line.detail }}</span>
                    </template>
                </template>
            </div>
        </template>
        <template v-if="thinking">
            <p class="dump-thinking">
                <WorkingDots />
                {{ thinking }}
            </p>
        </template>
    </div>
</template>

<style scoped>
.dump-narr {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 14px;
    min-height: 0;
    padding-right: 2px;
    overflow-y: auto;
    scrollbar-width: thin;
}

.dump-line {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--text-3);
}

.dump-line-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.dump-line-title {
    flex: 1;
    min-width: 0;
    font-weight: 500;
    color: var(--text-2);
}

.dump-line.now .dump-line-title {
    color: var(--text);
}

.dump-line-age {
    flex: none;
    font: 10.5px var(--mono);
    color: var(--text-4);
}

.dump-line-detail {
    color: var(--text-3);
    text-wrap: pretty;
}

.dump-line.mine {
    align-self: flex-end;
    max-width: 88%;
    padding: 6px 10px;
    border-radius: 12px 12px 4px 12px;
    background: var(--sel);
    color: var(--text);
}

.dump-thinking {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 12.5px;
    color: var(--text-3);
}
</style>
