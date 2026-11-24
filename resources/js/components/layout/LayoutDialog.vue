<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import Button from '@/components/kit/Button.vue';
import { useGuidedCreation } from '@/components/creation/guidedCreation';
import Dialog from '@/components/kit/Dialog.vue';
import DraftedBanner from '@/components/kit/DraftedBanner.vue';
import Icon from '@/components/kit/Icon.vue';
import MenuGroup from '@/components/kit/MenuGroup.vue';
import MenuItem from '@/components/kit/MenuItem.vue';
import MenuItemLabel from '@/components/kit/MenuItemLabel.vue';
import MenuItemSub from '@/components/kit/MenuItemSub.vue';
import SplitButton from '@/components/kit/SplitButton.vue';
import type { LayoutPartData } from '@/generated/types/core';
import LayoutConfirmation from './LayoutConfirmation.vue';
import LayoutPart from './LayoutPart.vue';
import { provideFormDraft, provideFormSent } from './layoutForm';

// A dialog of a declared layout: its opener is drawn in place and opens it; its form sends through the form's own
// registered submission and keeps its draft with the focus on the first invalid field. Cancel and Escape give the
// focus back to the opener, a page change closes it, and once the form is accepted it closes and a toast says so,
// offering Undo only when the declaration supplies an inverse action. When the declaration names a noun with a draft
// producer, the dialog offers the guided entry; the fields it drafts fill this form under a banner naming the agent,
// and nothing is saved until the form is sent. A dialog that names its other ways calls its footer's guided button by
// the way's name, and, in a page header, draws its opener as the kit's split button: the opener's label as the main
// part, and a menu of the plain way and the way with an agent; an opener that leads to a page stays a link, and the
// guided way drafts the fields the form then shows.
const props = defineProps<{ part: LayoutPartData }>();
const page = usePage();
const isOpen = ref(false);
const isConfirmed = ref(false);
const { ask } = useGuidedCreation();
const drafted = ref<{ agent: string; fields: Record<string, string> } | null>(null);
const draftedFields = ref<Record<string, string> | null>(null);
const opener = computed(() => props.part.children[0]);
const form = computed(() => props.part.children[1]);
const ways = computed(() => props.part.dialog?.ways);
const guidedFooter = computed(() =>
    ways.value === undefined ? 'Answer questions instead' : `${ways.value.guided} instead`,
);

function openFromOpener(event: MouseEvent): void {
    const isItem = (event.target as Element).closest('[role^="menuitem"]') !== null;

    if (opener.value.tag === 'action' || isItem) {
        isOpen.value = true;
    }
}

function openPlain(): void {
    const href = opener.value.action?.href;

    if (href !== undefined) {
        router.visit(href);

        return;
    }

    isOpen.value = true;
}

function close(): void {
    isOpen.value = false;
}

function confirmed(): void {
    isOpen.value = false;
    isConfirmed.value = true;
}

function startGuided(): void {
    const noun = props.part.dialog?.guidedNoun;

    if (noun === undefined) {
        return;
    }

    close();
    ask({
        noun,
        onDraft: (draft) => {
            drafted.value = draft;
            draftedFields.value = draft.fields;
            isOpen.value = true;
        },
    });
}

provideFormSent(confirmed);
provideFormDraft(draftedFields);
watch(() => page.url, close);
</script>

<template>
    <template v-if="ways?.isInHeader">
        <SplitButton
            :label="opener.text ?? ''"
            icon="plus"
            :hint="ways.plain"
            :noun="part.dialog?.guidedNoun ?? ''"
            @create="openPlain"
        >
            <MenuGroup :label="part.dialog?.title ?? ''">
                <MenuItem @click="openPlain">
                    <template #leading>
                        <Icon name="plus" :size="14" />
                    </template>
                    <MenuItemLabel>{{ ways.plain }}</MenuItemLabel>
                </MenuItem>
                <MenuItem @click="startGuided">
                    <template #leading>
                        <Icon name="speech" :size="14" />
                    </template>
                    <MenuItemLabel>{{ ways.guided }}</MenuItemLabel>
                    <MenuItemSub>An agent asks a few questions, then drafts it.</MenuItemSub>
                </MenuItem>
            </MenuGroup>
        </SplitButton>
    </template>
    <template v-else>
        <span @click="openFromOpener">
            <LayoutPart :part="opener" />
        </span>
    </template>
    <Dialog :open="isOpen" :title="part.dialog?.title ?? ''" @close="close">
        <div class="flex flex-col gap-3">
            <template v-if="drafted !== null">
                <DraftedBanner :agent="drafted.agent" />
            </template>
            <LayoutPart :part="form" />
        </div>
        <template #footer>
            <template v-if="part.dialog?.guidedNoun !== undefined">
                <Button variant="ghost" @click="startGuided">{{ guidedFooter }}</Button>
            </template>
            <Button variant="ghost" @click="close">Cancel</Button>
        </template>
    </Dialog>
    <template v-if="isConfirmed">
        <LayoutConfirmation
            :text="part.dialog?.confirmation ?? ''"
            :undo="part.dialog?.undo"
            @close="isConfirmed = false"
        />
    </template>
</template>
