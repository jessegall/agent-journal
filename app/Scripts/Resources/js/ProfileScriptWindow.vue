<script setup lang="ts">
import { autocompletion } from '@codemirror/autocomplete';
import { linter } from '@codemirror/lint';
import { EditorView, basicSetup } from 'codemirror';
import type { ProfileDraftData, ProfileScriptPageData } from '@generated/types/scripts';
import Button from '@kit/Button';
import PageHeader from '@kit/PageHeader';
import { postJson } from '@kit/jsonRequests';
import { check as checkDraft, save as saveDraft } from '@/routes/profiles/draft';
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { editorDiagnostics, scriptCompletion, scriptHighlighting, type ScriptVocabulary } from './scriptLanguage';
import ScriptFlowchart from './ScriptFlowchart.vue';

/**
 * The owner's editor of one profile's shared script draft: highlighting and completion come from the language the
 * journal reports, diagnostics from its check of the text as it is now, and saving goes in at the revision read. A
 * check answered for older text is dropped, and a changed catalogue asks for the page to be read again.
 */
const props = defineProps<{ data: ProfileScriptPageData }>();

const draft = ref<ProfileDraftData>(props.data.draft);
const revision = ref<number>(props.data.draft.revision);
const notice = ref<string>('');
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

async function check(): Promise<void> {
    const source = text();
    const reply = await postJson<ProfileDraftData>(checkDraft().url, {
        profile: draft.value.profile,
        source,
        commands: draft.value.commands,
    });

    if (!reply.ok || source !== text()) {
        return;
    }

    if (reply.value.catalogueDigest !== props.data.language.catalogueDigest) {
        notice.value = 'The script language changed; reload the page to edit with it. Your text stays.';
    }

    draft.value = { ...reply.value, source };
}

async function save(): Promise<void> {
    const reply = await postJson<ProfileDraftData>(saveDraft().url, {
        request_key: crypto.randomUUID(),
        profile: draft.value.profile,
        expectedRevision: revision.value,
        source: text(),
        commands: draft.value.commands,
    });

    if (!reply.ok) {
        notice.value = reply.message;

        return;
    }

    draft.value = reply.value;
    revision.value = reply.value.revision;
    notice.value = `Saved as revision ${reply.value.revision}.`;
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
            <Button @click="save">Save revision {{ revision + 1 }}</Button>
            <span class="text-sm text-muted-foreground">
                {{ draft.diagnostics.length === 0 ? 'No problems found.' : `${draft.diagnostics.length} problems.` }}
            </span>
        </div>
        <template v-if="draft.flowchart !== undefined && draft.flowchart !== null">
            <ScriptFlowchart :flowchart="draft.flowchart" @select-line="selectLine" />
        </template>
    </div>
</template>
