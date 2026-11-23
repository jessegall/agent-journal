<script setup lang="ts">
import Input from '@kit/Input';
import { useCloseOutside } from '@/composables/useCloseOutside';
import { useMenuKeys } from '@/composables/useMenuKeys';
import { router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import Button from '@kit/Button';
import Icon from '@/components/kit/Icon.vue';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import layoutRoutes from '@/routes/layouts';
import type { LayoutData } from '@/types/generated';
import { arrangementFrom, keptOnScreen, sameArrangement } from './arrangement';
import type { Arrangement } from './arrangement';
import LayoutThumb from './LayoutThumb.vue';

/**
 * Version 5's layout picker (agents/LayoutPicker.vue with kit/PresetList.vue): the presets, then the user's saved
 * layouts, each a row with its thumbnail; a saved row shows its tools on hover: save the current layout to it,
 * download it, rename and delete. Save layout names a new one inline, Import reads a layout file, and the notice line
 * says why a save, a name or a file was refused. The arrow keys move between the rows and Escape closes it with the
 * focus back on its button.
 */
const props = defineProps<{ layouts: LayoutData[] }>();

const emit = defineEmits<{ done: [] }>();

const store = usePaneLayout();
const panel = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
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

function apply(arrangement: Arrangement): void {
    store.apply(keptOnScreen(arrangement, store.screen()));
    emit('done');
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

async function importFile(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
        return;
    }

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
    } finally {
        (event.target as HTMLInputElement).value = '';
    }
}

const { onKeydown } = useMenuKeys(panel);
const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

// Escape closes the menu and gives the focus back to the button that opened it.
function closeToOpener(): void {
    emit('done');
    opener?.focus();
}

useCloseOutside(panel, () => emit('done'));
</script>

<template>
    <div
        ref="panel"
        role="menu"
        aria-label="Layouts"
        @keydown="onKeydown"
        @keydown.escape.stop="closeToOpener"
        class="z-90 flex max-h-[min(70vh,560px)] w-[300px] min-w-60 flex-col gap-0.5 overflow-y-auto rounded-menu border border-border-2 bg-raised p-1.5 shadow-[0_14px_36px_rgba(0,0,0,.45)]"
    >
        <span
            class="px-2 pt-1.5 pb-1 text-group font-semibold tracking-[.06em] text-text-4 uppercase"
            >Presets</span
        >
        <template v-for="preset in store.presets.value" :key="preset.name">
            <button
                type="button"
                role="menuitemradio"
                :aria-checked="isCurrent(preset.arrangement)"
                class="flex items-center gap-[11px] rounded-control px-2 py-1.5 text-left text-small text-text-2 hover:bg-hover hover:text-text"
                :class="{ 'bg-sel text-text': isCurrent(preset.arrangement) }"
                @click="apply(preset.arrangement)"
            >
                <LayoutThumb
                    :arrangement="preset.arrangement"
                    :first-window="firstWindow"
                    :is-current="isCurrent(preset.arrangement)"
                />
                <span class="min-w-0 flex-1 truncate">{{ preset.name }}</span>
            </button>
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
                <button
                    type="button"
                    role="menuitemradio"
                    :aria-checked="isCurrent(layout.arrangement)"
                    class="flex min-w-0 flex-1 items-center gap-[11px] text-left"
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
                </button>
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
                <Button @click="fileInput?.click()"
                    ><Icon name="upload" :size="12" />Import</Button
                >
                <input
                    ref="fileInput"
                    type="file"
                    accept="application/json,.json"
                    class="hidden"
                    aria-label="Layout file to import"
                    @change="importFile"
                />
            </template>
        </div>
        <template v-if="notice">
            <p class="px-2 pt-1.5 text-small text-danger" role="status">
                {{ notice }}
            </p>
        </template>
    </div>
</template>
