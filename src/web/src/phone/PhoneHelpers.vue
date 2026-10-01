<script setup>
import {computed, ref} from "vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {HELPER_WORDS, helperView, helpersInOrder} from "../domain/helpers.js";
import PhoneChevron from "./PhoneChevron.vue";

const props = defineProps({helpers: {type: Array, default: () => []}, stopping: {type: Number, default: 0}});
const emit = defineEmits(["stop"]);
const listed = computed(() => helpersInOrder(props.helpers, 3).map(helperView));
const opened = ref(0);
const asking = ref(0);
const toggle = (row) => (opened.value = opened.value === row.n ? 0 : row.n);
</script>

<template>
    <template v-if="listed.length">
        <section class="helpers" aria-label="Helpers">
            <h3 class="helpers-title">Helpers</h3>
            <ul class="helpers-list">
                <template v-for="helper in listed" :key="helper.n">
                    <li>
                        <button
                            type="button"
                            :class="['helper', {stoppable: helper.state === 'running'}]"
                            :aria-expanded="helper.report ? opened === helper.n : undefined"
                            :disabled="!helper.report"
                            @click="toggle(helper)"
                        >
                            <span :class="['helper-dot', helper.state]" aria-hidden="true" />
                            <span class="helper-words">
                                <span class="helper-name">{{ helper.name }} · {{ helper.title }}</span>
                                <span class="helper-line">{{ helper.line }}</span>
                            </span>
                            <span :class="['helper-state', helper.state]">{{ HELPER_WORDS[helper.state] }}</span>
                            <template v-if="helper.report">
                                <PhoneChevron :facing="opened === helper.n ? 'up' : 'down'" :size="12" />
                            </template>
                        </button>
                        <template v-if="helper.state === 'running'">
                            <template v-if="asking === helper.n">
                                <p class="helper-ask">
                                    {{ helper.name }} is working on “{{ helper.title }}”. Stop it anyway? It ends its session.
                                </p>
                                <div class="helper-choices">
                                    <button type="button" class="helper-stop" @click="asking = 0">Cancel</button>
                                    <button
                                        type="button"
                                        class="helper-stop danger"
                                        :disabled="stopping === helper.n"
                                        @click="emit('stop', helper.row)"
                                    >
                                        {{ stopping === helper.n ? "Stopping…" : "Stop" }}
                                    </button>
                                </div>
                            </template>
                            <template v-else>
                                <button type="button" class="helper-stop" :aria-label="`Stop ${helper.name}`" @click="asking = helper.n">
                                    Stop
                                </button>
                            </template>
                        </template>
                        <template v-if="opened === helper.n">
                            <TextDisplay class="helper-report" :text="helper.report" />
                        </template>
                    </li>
                </template>
            </ul>
        </section>
    </template>
</template>

<style scoped>
.helpers {
    margin-bottom: 12px;
}

.helpers-title {
    margin: 0 0 6px;
    padding: 0 4px;
    color: var(--text-2);
    font-size: 0.765rem;
    font-weight: 600;
}

.helpers-list {
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
    list-style: none;
}

.helpers-list li + li {
    border-top: 1px solid var(--line);
}

.helper {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 52px;
    padding: 8px 16px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
}

.helper:disabled {
    opacity: 1;
}

.helper-dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-4);
}

.helper-dot.running {
    background: var(--accent);
}

.helper-dot.reported {
    background: var(--tone-good);
}

.helper-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.helper-name {
    overflow: hidden;
    font-size: 0.882rem;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.helper-line {
    color: var(--text-2);
    font-size: 0.765rem;
}

.helper-state {
    flex: none;
    color: var(--text-2);
    font-size: 0.765rem;
}

.helper-state.reported {
    color: var(--tone-good);
    font-weight: 600;
}

.helpers-list li {
    position: relative;
}

.helper.stoppable {
    padding-right: 84px;
}

.helper-ask {
    margin: 8px 12px 0;
    color: var(--text);
    font-size: 0.882rem;
    line-height: 1.4;
}

.helper-choices {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 8px 12px 12px;
}

.helper-choices .helper-stop {
    position: static;
    margin-top: 0;
}

.helper-choices .helper-stop:first-child {
    background: var(--hover);
    color: var(--text);
}

.helper-stop.danger {
    background: var(--danger);
    color: #fff;
}

.helper-stop {
    position: absolute;
    top: 50%;
    right: 12px;
    min-width: 64px;
    min-height: 36px;
    margin-top: -18px;
    padding: 0 12px;
    border: 0;
    border-radius: 18px;
    background: color-mix(in oklab, var(--danger) 14%, transparent);
    color: var(--danger);
    font: inherit;
    font-size: 0.824rem;
    font-weight: 600;
}

.helper-report {
    margin: 0 16px 12px 34px;
    color: var(--text-2);
    font-size: 0.882rem;
}
</style>
