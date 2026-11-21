<script setup lang="ts">
import { nextTick, reactive, ref, useId, watch } from 'vue';
import Button from '@kit/Button';
import CountedProgress from '@kit/CountedProgress';
import Disclosure from '@kit/Disclosure';
import { useWindowReload } from '@kit/useWindowQuery';
import type { PhaseHeadingData, PlanOutlineData } from '@generated/types/plans';
import PhaseTaskList from './PhaseTaskList.vue';
import { currentPhaseRule, progressText } from './planLooks';
import { usePhasePages } from './usePhasePages';

/**
 * A plan's phases in their order, a page of headings at a time: each heading with its counted progress, the Current
 * phase marker in words and a disclosure that opens the phase's tasks, each opened phase paging on its own cursor.
 */
const props = defineProps<{ outline: PlanOutlineData }>();

const idPrefix = useId();
const reload = useWindowReload();
const { phases: pages, open, loadMore, retry } = usePhasePages(
    () => props.outline.phaseTasks,
    true,
);
const headings = ref<PhaseHeadingData[]>([]);
const nextPhasesAfter = ref<string | undefined>(undefined);
const askedPhasesAfter = ref('0');
const isLoadingPhases = ref(false);
const expanded = reactive(new Set<string>());

watch(
    () => props.outline,
    (outline) => {
        const byNumber = new Map(
            headings.value.map((heading) => [heading.number, heading]),
        );

        for (const heading of outline.phases) {
            byNumber.set(heading.number, heading);
        }

        headings.value = [...byNumber.values()].sort(
            (first, second) => Number(first.number) - Number(second.number),
        );

        if (outline.phasesAfter === askedPhasesAfter.value) {
            nextPhasesAfter.value = outline.nextPhasesAfter;
            isLoadingPhases.value = false;
        }
    },
    { immediate: true },
);

function headingId(number: string): string {
    return `${idPrefix}-phase-${number}`;
}

function toggle(heading: PhaseHeadingData): void {
    if (expanded.has(heading.number)) {
        expanded.delete(heading.number);

        return;
    }

    expanded.add(heading.number);
    open(heading.number, heading.revision);
}

async function focusHeading(number: string): Promise<void> {
    await nextTick();
    document.getElementById(headingId(number))?.focus();
}

function failPhases(): boolean {
    isLoadingPhases.value = false;

    return false;
}

function loadMorePhases(): void {
    if (nextPhasesAfter.value === undefined) {
        return;
    }

    askedPhasesAfter.value = nextPhasesAfter.value;
    isLoadingPhases.value = true;
    reload(
        { phases_after: nextPhasesAfter.value },
        { onNetworkError: failPhases, onHttpException: failPhases },
    );
}
</script>

<template>
    <section class="mt-4 flex flex-col gap-3" aria-label="Phases">
        <ol class="flex flex-col gap-3">
            <template v-for="heading in headings" :key="heading.number">
                <li class="flex flex-col gap-1.5 border-t border-border pt-3">
                    <h3
                        :id="headingId(heading.number)"
                        tabindex="-1"
                        class="text-body font-medium outline-none focus-visible:outline-2 focus-visible:outline-text"
                    >
                        <Disclosure
                            :expanded="expanded.has(heading.number)"
                            :controls="`${headingId(heading.number)}-tasks`"
                            @toggle="toggle(heading)"
                        >
                            <span class="tabular-nums"
                                >Phase {{ heading.number }}</span
                            >
                            <span class="[overflow-wrap:anywhere]">{{
                                heading.title
                            }}</span>
                        </Disclosure>
                    </h3>
                    <template v-if="heading.isCurrent">
                        <span
                            class="text-small font-medium text-text-2"
                            :title="currentPhaseRule"
                            >Current phase</span
                        >
                    </template>
                    <CountedProgress
                        :owner="`phase ${heading.number}`"
                        :finished="heading.finishedTasks"
                        :total="heading.totalTasks"
                        :text="progressText(heading)"
                    />
                    <div
                        v-show="expanded.has(heading.number)"
                        :id="`${headingId(heading.number)}-tasks`"
                        role="region"
                        :aria-labelledby="headingId(heading.number)"
                    >
                        <template v-for="phasePages in [pages.get(heading.number)]">
                            <template v-if="phasePages !== undefined">
                                <PhaseTaskList
                                    :pages="phasePages"
                                    :phase-name="`phase ${heading.number}`"
                                    @load-more="loadMore(heading.number)"
                                    @retry="retry(heading.number)"
                                    @ended="focusHeading(heading.number)"
                                />
                            </template>
                        </template>
                    </div>
                </li>
            </template>
        </ol>
        <template v-if="nextPhasesAfter !== undefined">
            <div>
                <Button
                    size="small"
                    variant="bordered"
                    :pending="isLoadingPhases"
                    @click="loadMorePhases"
                    >More phases</Button
                >
            </div>
        </template>
    </section>
</template>
