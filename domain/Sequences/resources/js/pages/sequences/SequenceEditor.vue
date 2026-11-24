<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import Button from '@kit/Button';
import DraftedBanner from '@kit/DraftedBanner';
import Field from '@kit/Field';
import FormErrors from '@kit/FormErrors';
import Icon from '@kit/Icon';
import IconButton from '@kit/IconButton';
import type { SequenceEditorPartData } from '@generated/types/sequences';
import { canMove, emptyStep, errorsByStep, moveStep, moveTo, oppositeOf, removeStep } from '../../sequenceDraft';
import type { Direction, FocusAfter } from '../../sequenceDraft';

/**
 * The steps of a sequence definition as an editable list: each row holds Step title, Runs when and Done when, which
 * stack on a phone, a drag handle, Move up, Move down and Remove. Dragging the handle or the move buttons reorder, the
 * ends' moves are off, and the focus stays on the moved row's arrow that is still available. Removing focuses the row
 * now in its place or Add a step; with no step Add a step is all there is, and adding focuses the new title. Saving sends
 * the draft to the registered create or update address; the server's errors show beside their step and field and a
 * failed save keeps the order and every text. A saved edit focuses Edit steps, which the page after it holds.
 */
const props = defineProps<SequenceEditorPartData>();

const name = ref(props.name);
const steps = ref([...props.steps]);
const errors = ref<Record<string, string>>({});
const isSaving = ref(false);
const root = useTemplateRef<HTMLElement>('root');
const addWrap = useTemplateRef<HTMLElement>('addWrap');
const dragging = ref<string | null>(null);

const parsed = computed(() => errorsByStep(errors.value));

function stepElement(id: string): HTMLElement | null {
    return root.value?.querySelector<HTMLElement>(`[data-step="${id}"]`) ?? null;
}

function focusAfter(target: FocusAfter): void {
    void nextTick(() => {
        if (target.kind === 'add') {
            addWrap.value?.querySelector<HTMLElement>('button')?.focus();

            return;
        }

        stepElement(target.id)?.querySelector<HTMLElement>('input')?.focus();
    });
}

function add(): void {
    const step = emptyStep(crypto.randomUUID());

    steps.value = [...steps.value, step];
    focusAfter({ kind: 'step', id: step.id });
}

function remove(id: string): void {
    const result = removeStep(steps.value, id);

    steps.value = result.steps;
    focusAfter(result.focus);
}

function move(id: string, direction: Direction): void {
    steps.value = moveStep(steps.value, id, direction);

    void nextTick(() => {
        const available: Direction = canMove(steps.value, id, direction) ? direction : oppositeOf(direction);

        stepElement(id)?.querySelector<HTMLElement>(`[data-move="${available}"]`)?.focus();
    });
}

function startDrag(event: PointerEvent, id: string): void {
    event.preventDefault();
    dragging.value = id;

    function place(at: PointerEvent): void {
        const rows = [...(root.value?.querySelectorAll<HTMLElement>('[data-step]') ?? [])].filter(
            (row) => row.dataset.step !== id,
        );
        const index = rows.findIndex((row) => at.clientY < row.getBoundingClientRect().top + row.offsetHeight / 2);

        steps.value = moveTo(steps.value, id, index === -1 ? rows.length : index);
    }

    function stop(): void {
        window.removeEventListener('pointermove', place);
        window.removeEventListener('pointerup', stop);
        dragging.value = null;
    }

    window.addEventListener('pointermove', place);
    window.addEventListener('pointerup', stop);
}

function save(): void {
    isSaving.value = true;
    errors.value = {};

    router.visit(props.saveAddress, {
        method: props.method === 'PATCH' ? 'patch' : 'post',
        data: {
            name: name.value,
            version: props.version ?? null,
            steps: steps.value.map((step) => ({
                id: step.id,
                title: step.title,
                runs_when: step.runsWhen,
                done_when: step.doneWhen,
            })),
        },
        preserveState: true,
        preserveScroll: true,
        onError: (received) => (errors.value = received),
        onSuccess: () => void nextTick(() => document.querySelector<HTMLElement>('[data-edit-steps]')?.focus()),
        onFinish: () => (isSaving.value = false),
    });
}
</script>

<template>
    <form ref="root" class="flex flex-col gap-3" @submit.prevent="save">
        <template v-if="draftedBy !== undefined">
            <DraftedBanner :agent="draftedBy" />
        </template>
        <FormErrors :errors="Object.fromEntries(parsed.others.map((message, index) => [`other-${index}`, message]))" />
        <Field v-model="name" label="Name" :error="errors.name" />
        <template v-if="steps.length === 0">
            <p class="text-small text-text-3">This sequence has no steps yet.</p>
        </template>
        <ol class="m-0 flex list-none flex-col gap-2 p-0">
            <template v-for="(step, index) in steps" :key="step.id">
                <li
                    :data-step="step.id"
                    class="flex gap-2 rounded-card border border-line p-2"
                    :class="dragging === step.id && 'bg-sel'"
                >
                    <IconButton
                        icon="dots-vertical"
                        :label="`Drag step ${index + 1}`"
                        class="cursor-grab self-start"
                        @pointerdown="startDrag($event, step.id)"
                    />
                    <div class="grid min-w-0 flex-1 grid-cols-1 gap-2 @2xl:grid-cols-3">
                        <Field v-model="step.title" label="Step title" :error="parsed.byStep[step.id]?.title" />
                        <Field v-model="step.runsWhen" label="Runs when" :error="parsed.byStep[step.id]?.runsWhen" />
                        <Field v-model="step.doneWhen" label="Done when" :error="parsed.byStep[step.id]?.doneWhen" />
                    </div>
                    <div class="flex shrink-0 flex-col gap-1 self-start">
                        <Button
                            variant="icon"
                            data-move="up"
                            :aria-label="`Move step ${index + 1} up`"
                            :disabled="!canMove(steps, step.id, 'up')"
                            @click="move(step.id, 'up')"
                            ><Icon name="caret" :size="14" class="rotate-180"
                        /></Button>
                        <Button
                            variant="icon"
                            data-move="down"
                            :aria-label="`Move step ${index + 1} down`"
                            :disabled="!canMove(steps, step.id, 'down')"
                            @click="move(step.id, 'down')"
                            ><Icon name="caret" :size="14"
                        /></Button>
                        <Button variant="icon" :aria-label="`Remove step ${index + 1}`" @click="remove(step.id)"
                            ><Icon name="trash" :size="14"
                        /></Button>
                    </div>
                </li>
            </template>
        </ol>
        <div class="flex flex-wrap items-center gap-2">
            <span ref="addWrap"><Button variant="bordered" @click="add">Add a step</Button></span>
            <Button type="submit" variant="primary" :pending="isSaving">Save</Button>
            <Button variant="ghost" :href="cancelAddress">Cancel</Button>
        </div>
    </form>
</template>
