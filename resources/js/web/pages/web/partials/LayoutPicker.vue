<script setup lang="ts">
import Input from '@kit/Input';
import { useSidebar } from '@/composables/useSidebar';
import { router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import Button from '@kit/Button';
import FileChooser from '@kit/FileChooser';
import Popover from '@kit/Popover';
import Icon from '@/components/kit/Icon.vue';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import layoutRoutes from '@/routes/layouts';
import type { LayoutData } from '@/types/generated';
import { arrangementFrom, keptOnScreen, sameArrangement } from '@/components/panes/arrangement';
import type { Arrangement, Preset } from '@/components/panes/arrangement';
import LayoutThumb from './LayoutThumb.vue';

/**
 * The layouts under the bar's Layouts button: the presets, then the saved layouts with their thumbnails and their tools
 * on hover and focus. Save layout names a new one inline, Import reads a file, the notice line says why something was
 * refused, and Escape closes it.
 */
const props = defineProps<{ layouts: LayoutData[]; anchor: HTMLElement | null }>();

const open = defineModel<boolean>('open', { default: false });

const store = usePaneLayout();
const notice = ref('');
const newName = ref<string | null>(null);
const renaming = ref<{ id: string; name: string } | null>(null);

const knownWindows = computed(() =>
    store.windows.value.map((each) => each.key),
);
const firstWindow = computed(() => knownWindows.value[0]);

const savedLayouts = computed(() =>
    props.layouts.flatMap((layout) => {
        const arrangement = arrangementFrom(layout.shape, knownWindows.value);

        return arrangement ? [{ ...layout, arrangement }] : [];
    }),
);

function isCurrent(arrangement: Arrangement): boolean {
    return sameArrangement(arrangement, store.arrangement.value);
}

const sidebar = useSidebar();

function apply(arrangement: Arrangement): void {
    store.apply(keptOnScreen(arrangement, store.screen()));
    open.value = false;
}

function applyPreset(preset: Preset): void {
    if (preset.foldsSidebar === true) {
        sidebar.fold();
    }

    apply(preset.arrangement);
}

function refusalOf(errors: Record<string, string>): string {
    return errors.name ?? errors.shape ?? 'The layout was not saved.';
}

const requestOptions = {
    preserveScroll: true,
    preserveState: true,
    onSuccess: () => {
        notice.value = '';
    },
    onError: (errors: Record<string, string>) => {
        notice.value = refusalOf(errors);
    },
};

function saveNew(name: string, arrangement: Arrangement): void {
    router.post(
        layoutRoutes.store.url(),
        { name, shape: arrangement },
        {
            ...requestOptions,
            onSuccess: () => {
                notice.value = '';
                newName.value = null;
            },
        },
    );
}

function saveTo(id: string, name: string, arrangement: Arrangement): void {
    router.put(
        layoutRoutes.update.url(id),
        { name, shape: arrangement },
        {
            ...requestOptions,
            onSuccess: () => {
                notice.value = '';
                renaming.value = null;
            },
        },
    );
}

function remove(id: string): void {
    router.delete(layoutRoutes.destroy.url(id), requestOptions);
}

function submitNewName(): void {
    const name = (newName.value ?? '').trim();

    if (name === '') {
        notice.value = 'Give the layout a name.';

        return;
    }

    saveNew(name, store.arrangement.value);
}

function submitRename(arrangement: Arrangement): void {
    const target = renaming.value;

    if (!target || target.name.trim() === '') {
        notice.value = 'Give the layout a name.';

        return;
    }

    saveTo(target.id, target.name.trim(), arrangement);
}

function download(name: string, arrangement: Arrangement): void {
    const file = new Blob(
        [JSON.stringify({ name, shape: arrangement }, null, 2)],
        {
            type: 'application/json',
        },
    );
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = `${name}.layout.json`;
    link.click();
    URL.revokeObjectURL(link.href);
}

async function importFile(file: File): Promise<void> {
    try {
        const content: unknown = JSON.parse(await file.text());
        const record =
            typeof content === 'object' && content !== null
                ? (content as Record<string, unknown>)
                : {};
        const arrangement = arrangementFrom(record.shape, knownWindows.value);
        const name =
            typeof record.name === 'string'
                ? record.name
                : file.name.replace(/\.layout\.json$|\.json$/, '');

        if (!arrangement) {
            notice.value = 'This file is not a layout.';

            return;
        }

        saveNew(name, arrangement);
    } catch {
        notice.value = 'This file is not a layout.';
    }
}

</script>

<template>
    <Popover v-model:open="open" label="Layouts" :anchor="anchor" align="right" :width="300">
        <div class="flex max-h-[min(70vh,560px)] flex-col gap-0.5 overflow-y-auto p-1.5">
            <span
                class="px-2 pt-1.5 pb-1 text-group font-semibold tracking-[.06em] text-text-4 uppercase"
                >Presets</span
            >
            <template v-for="preset in store.presets.value" :key="preset.name">
                <Button
                    :pressed="isCurrent(preset.arrangement)"
                    class="w-full justify-start gap-[11px] px-2 py-1.5 text-left text-small"
                    :class="{ 'bg-sel text-text': isCurrent(preset.arrangement) }"
                    @click="applyPreset(preset)"
                >
                    <LayoutThumb
                        :arrangement="preset.arrangement"
                        :first-window="firstWindow"
                        :is-current="isCurrent(preset.arrangement)"
                    />
                    <span class="min-w-0 flex-1 truncate">{{ preset.name }}</span>
                </Button>
            </template>
            <template v-if="savedLayouts.length">
                <span
                    class="px-2 pt-2.5 pb-1 text-group font-semibold tracking-[.06em] text-text-4 uppercase"
                    >Saved</span
                >
            </template>
            <template v-for="layout in savedLayouts" :key="layout.id">
                <div
                    class="group flex items-center gap-[11px] rounded-control px-2 py-1.5 text-small text-text-2 hover:bg-hover hover:text-text"
                    :class="{ 'bg-sel text-text': isCurrent(layout.arrangement) }"
                >
                    <Button
                        :pressed="isCurrent(layout.arrangement)"
                        class="min-w-0 flex-1 justify-start gap-[11px] text-left"
                        @click="apply(layout.arrangement)"
                    >
                        <LayoutThumb
                            :arrangement="layout.arrangement"
                            :first-window="firstWindow"
                            :is-current="isCurrent(layout.arrangement)"
                        />
                        <template v-if="renaming?.id !== layout.id">
                            <span class="min-w-0 flex-1 truncate">{{
                                layout.name
                            }}</span>
                        </template>
                    </Button>
                    <template v-if="renaming?.id === layout.id">
                        <Input
                            v-model="renaming.name"
                            aria-label="Layout name"
                            maxlength="80"
                            class="h-6 min-w-0 flex-1 rounded-control border border-border-2 bg-bg-2 px-2 text-small text-text outline-none focus:border-brand"
                            @keydown.enter.prevent="
                                submitRename(layout.arrangement)
                            "
                            @keydown.escape.stop="renaming = null"
                        />
                    </template>
                    <template v-else>
                        <span
                            class="hidden flex-none items-center gap-0.5 group-focus-within:flex group-hover:flex"
                        >
                            <Button
                                variant="icon"
                                title="Save the current layout to it"
                                aria-label="Save the current layout to it"
                                @click="
                                    saveTo(
                                        layout.id,
                                        layout.name,
                                        store.arrangement.value,
                                    )
                                "
                                ><Icon name="tick" :size="12"
                            /></Button>
                            <Button
                                variant="icon"
                                title="Download it as a file"
                                aria-label="Download it as a file"
                                @click="download(layout.name, layout.arrangement)"
                                ><Icon name="download" :size="12"
                            /></Button>
                            <Button
                                variant="icon"
                                title="Rename"
                                aria-label="Rename"
                                @click="
                                    renaming = { id: layout.id, name: layout.name }
                                "
                                ><Icon name="pencil" :size="12"
                            /></Button>
                            <Button
                                variant="icon"
                                title="Delete"
                                aria-label="Delete"
                                @click="remove(layout.id)"
                                ><Icon name="trash" :size="12"
                            /></Button>
                        </span>
                    </template>
                </div>
            </template>
            <div
                class="mt-1.5 flex items-center gap-1.5 border-t border-border px-1 pt-2"
            >
                <template v-if="newName !== null">
                    <Input
                        v-model="newName"
                        aria-label="Name of the new layout"
                        placeholder="Name of the layout"
                        maxlength="80"
                        class="h-[26px] min-w-0 flex-1 rounded-control border border-border-2 bg-bg-2 px-2 text-small text-text outline-none focus:border-brand"
                        @keydown.enter.prevent="submitNewName"
                        @keydown.escape.stop="newName = null"
                    />
                    <Button variant="primary" @click="submitNewName">Save</Button>
                </template>
                <template v-else>
                    <Button variant="bordered" @click="newName = ''"
                        ><Icon name="plus" :size="12" />Save layout</Button
                    >
                    <FileChooser
                        label="Layout file to import"
                        accept="application/json,.json"
                        icon="upload"
                        @chosen="importFile"
                        >Import</FileChooser
                    >
                </template>
            </div>
            <template v-if="notice">
                <p class="px-2 pt-1.5 text-small text-danger" role="status">
                    {{ notice }}
                </p>
            </template>
        </div>
    </Popover>
</template>
