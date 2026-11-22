<script setup lang="ts">
import { autocompletion } from '@codemirror/autocomplete';
import { linter } from '@codemirror/lint';
import { EditorView, basicSetup } from 'codemirror';
import type { ProfileDraftData, ProfileScriptPageData } from '@generated/types/scripts';
import Button from '@kit/Button';
import PageHeader from '@kit/PageHeader';
import { keyedPost } from '@kit/keyedPost';
import { useIsStale } from '@kit/windowFreshness';
import { checkDraft, saveDraft } from '@generated/routes/scripts';
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { editorDiagnostics, scriptCompletion, scriptHighlighting, type ScriptVocabulary } from './scriptLanguage';
import ScriptFlowchart from './ScriptFlowchart.vue';

/**
 * The owner's editor of one profile's shared script draft: highlighting and completion come from the language the
 * journal reports, diagnostics from its check of the text as it is now, and saving goes in at the revision read. A
 * check answered for older text is dropped, and a changed catalogue asks for the page to be read again. The text typed
 * stays through a refresh, also a failed one, while Save waits for a read that succeeds; 'No problems found' shows only
 * once a check of the text answered.
 */
const props = defineProps<{ data: ProfileScriptPageData }>();

const draft = ref<ProfileDraftData>(props.data.draft);
const revision = ref<number>(props.data.draft.revision);
const notice = ref<string>('');
// Whether a check answered for the text as it is now; before that the editor claims nothing about problems.
const isChecked = ref(false);
const isStale = useIsStale();
const host = ref<HTMLElement | null>(null);
const editor = shallowRef<EditorView | null>(null);

const vocabulary = computed<ScriptVocabulary>(() => ({
    keywords: props.data.language.keywords.filter((keyword) => keyword.available).map((keyword) => keyword.token),
    members: Object.fromEntries(
        props.data.language.objects
            .filter((object) => object.available)
            .map((object) => [object.key, Object.keys(object.members)]),
    ),
    commands: Object.keys(draft.value.commands),
}));

function text(): string {
    return editor.value?.state.doc.toString() ?? draft.value.source;
}

/**
 * Checks the text through the page's own action; the answer's one-time flash holds what checking found, and one
 * answered for older text is dropped.
 */
function check(): Promise<void> {
    const source = text();

    return new Promise((done) => {
        keyedPost(
            checkDraft.url(draft.value.profile),
            { profile: draft.value.profile, source, commands: draft.value.commands },
            crypto.randomUUID(),
            {
                onAccepted: (flash) => {
                    const checked = flash.checkedDraft as ProfileDraftData | undefined;

                    if (checked === undefined || source !== text()) {
                        return;
                    }

                    if (checked.catalogueDigest !== props.data.language.catalogueDigest) {
                        notice.value = 'The script language changed; reload the page to edit with it. Your text stays.';
                    }

                    draft.value = { ...checked, source };
                    isChecked.value = true;
                },
                onRefused: () => undefined,
                onUncertain: () => undefined,
                onFinish: () => done(),
            },
        );
    });
}

function save(): void {
    if (isStale.value) {
        return;
    }

    const requestKey = crypto.randomUUID();

    keyedPost(
        saveDraft.url(draft.value.profile),
        {
            request_key: requestKey,
            profile: draft.value.profile,
            expectedRevision: revision.value,
            source: text(),
            commands: draft.value.commands,
        },
        requestKey,
        {
            onAccepted: (flash) => {
                const saved = flash.savedDraft as ProfileDraftData | undefined;

                if (saved === undefined) {
                    return;
                }

                draft.value = saved;
                revision.value = saved.revision;
                notice.value = `Saved as revision ${saved.revision}.`;
            },
            onRefused: (reason) => (notice.value = reason ?? 'The draft was not saved.'),
            onUncertain: () => (notice.value = 'The journal did not answer; save again to be sure.'),
        },
    );
}

onMounted(() => {
    if (host.value === null) {
        return;
    }

    editor.value = new EditorView({
        doc: draft.value.source,
        parent: host.value,
        extensions: [
            basicSetup,
            scriptHighlighting(vocabulary.value),
            autocompletion({ override: [scriptCompletion(vocabulary.value)] }),
            linter(
                async (view) => {
                    await check();

                    return editorDiagnostics(view.state.doc, draft.value.diagnostics);
                },
                { delay: 400 },
            ),
        ],
    });
});

function selectLine(number: number): void {
    const view = editor.value;

    if (view === null || number > view.state.doc.lines) {
        return;
    }

    const line = view.state.doc.line(number);
    view.dispatch({ selection: { anchor: line.from, head: line.to }, scrollIntoView: true });
    view.focus();
}

onBeforeUnmount(() => editor.value?.destroy());
</script>

<template>
    <div class="flex flex-col gap-4 p-4">
        <PageHeader :title="`Script of ${draft.profile}`" />
        <template v-if="notice !== ''">
            <p class="text-sm text-muted-foreground">{{ notice }}</p>
        </template>
        <div ref="host" class="rounded border border-border font-mono text-sm" />
        <div class="flex items-center gap-2">
            <Button :disabled="isStale" @click="save">Save revision {{ revision + 1 }}</Button>
            <template v-if="isChecked">
                <span class="text-sm text-muted-foreground">
                    {{ draft.diagnostics.length === 0 ? 'No problems found.' : `${draft.diagnostics.length} problems.` }}
                </span>
            </template>
        </div>
        <template v-if="draft.flowchart !== undefined && draft.flowchart !== null">
            <ScriptFlowchart :flowchart="draft.flowchart" @select-line="selectLine" />
        </template>
    </div>
</template>
