<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Contracts\CommentResolver;
use App\Contracts\PageResolver;
use App\Contracts\RecordMenus;
use App\Contracts\RecordResolver;
use App\Contracts\ShareStatusResolver;
use App\Data\DockablePublicationData;
use App\Enums\ActionMethod;
use App\Support\Cards\DockIdentity;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBodyData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationPage;
use App\Support\Layout\PublicationTab;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\DraftResolver;
use Domain\Documents\Data\DocumentCommentsPartData;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\DraftEditorPartData;
use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\RecordCommentsPartData;
use Domain\Documents\Data\RecordLinksPartData;
use Domain\Documents\Data\RecordSharePartData;
use Domain\Documents\Data\RecoverDraftPartData;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Enums\EditingState;
use Domain\Documents\Http\Requests\RecordPageRequest;
use Domain\Documents\Models\Document;
use Domain\Documents\Support\RecordPageReads;
use Spatie\LaravelData\Optional;

/**
 * A document's page as a publication: its title, label, revision, actions menu and abstract; under them the editing part, which
 * stays mounted whichever tab is shown, so a held draft survives a tab change; then the tab the window chose, read
 * alone. Text is the numbered lines to comment on, the public-comment notice and the record's comments; Links its linked records; Details its editing and
 * attention, settlements, Settle and Share; History its revisions, each linking to its own page.
 */
final readonly class DocumentWindowResolver implements PageResolver
{
    public function __construct(
        private RecordPageRequest $request,
        private DocumentResolver $documents,
        private DraftResolver $drafts,
        private CommentResolver $comments,
        private RecordResolver $records,
        private ShareStatusResolver $shares,
        private RecordPageReads $reads,
        private RecordMenus $menus,
    ) {}

    public function read(): DockablePublicationData
    {
        $number = $this->request->documentNumber();
        $document = $this->documents->show($number);
        $identity = $this->records->identify(RecordReference::of('doc', $number));
        $editing = $this->drafts->stateOf($number);
        $label = "doc {$number}";

        $page = PublicationPage::make(
            $document->title,
            [
                LayoutPartData::text('label', $label, 'code'),
                LayoutPartData::text('revision', "revision {$document->revision}", 'muted'),
                LayoutPartData::menu(
                    'actions',
                    $this->menus->onRecord(DocumentsDomain::DOCUMENT_ACTIONS, (string) $number),
                ),
            ],
            $document->abstract,
            fn () => LayoutBodyData::fromMarkdown($document->body),
            [
                PublicationTab::deferred('text', 'Text', fn () => $this->textOf($document, $identity, $label)),
                PublicationTab::deferred('links', 'Links', fn () => LayoutPartData::native(
                    'links',
                    LayoutNativeData::of('documents/RecordLinks', RecordLinksPartData::from([
                        'source' => $label,
                        'links' => $this->documents->links($number),
                    ])),
                )),
                PublicationTab::deferred('details', 'Details', fn () => $this->detailsOf($document, $editing, $label)),
                PublicationTab::deferred('history', 'History', fn () => $this->historyOf($number)),
            ],
        )->withStanding($this->editingOf($document, $editing));

        return DockablePublicationData::of(
            $page->layout($this->request->chosenTab()),
            new DockIdentity(Document::LINK_TYPE, $document->id),
        );
    }

    private function textOf(DocumentView $document, RecordIdentity $identity, string $label): LayoutPartData
    {
        $commentList = $this->comments->list($identity, $this->request->commentsPage());
        $parts = [];

        if ($this->shares->isPubliclyShared($identity)) {
            $parts[] = LayoutPartData::notice(
                'public',
                'info',
                'This document is shared publicly: a comment you leave here will be public.',
            );
        }

        $lines = DocumentCommentsPartData::of($document->revision, $label, $document->body, $commentList);

        $parts[] = LayoutPartData::native('lines', LayoutNativeData::of('documents/DocumentComments', $lines));

        $comments = RecordCommentsPartData::from([
            'comments' => $commentList,
            'target' => $label,
            'reads' => $this->reads->of($identity),
            'version' => $document->revision,
        ]);

        $parts[] = LayoutPartData::native('comments', LayoutNativeData::of('documents/RecordComments', $comments));

        return LayoutPartData::box('text', 'stack', ...$parts);
    }

    /**
     * What the viewer may do with the draft: edit their own in the native editor, recover someone else's they may
     * recover, see who else edits it, or open it for editing while nobody holds it.
     */
    private function editingOf(DocumentView $document, DraftState $editing): LayoutPartData
    {
        if ($editing->state === EditingState::Yours && ! $editing->draft instanceof Optional) {
            $editor = DraftEditorPartData::from(['number' => $document->number, 'draft' => $editing->draft]);

            return LayoutPartData::native('editing', LayoutNativeData::of('documents/DraftEditor', $editor));
        }

        if ($editing->state === EditingState::Held && ! $editing->held instanceof Optional) {
            $recovery = RecoverDraftPartData::from([
                'number' => $document->number,
                'holder' => $this->holderOf($editing),
                'held' => $editing->held,
            ]);

            return LayoutPartData::native('editing', LayoutNativeData::of('documents/RecoverForm', $recovery));
        }

        if ($editing->state === EditingState::Held) {
            return LayoutPartData::notice('editing', 'info', "{$this->holderOf($editing)} is editing this document.");
        }

        return LayoutPartData::form(
            'editing',
            new LayoutFormData(
                ActionMethod::Post,
                route('documents.open-document', ['document' => $document->number], false),
            ),
            'inline',
            LayoutPartData::action('send', 'Edit', LayoutActionData::submitting()),
        );
    }

    /**
     * The document's editing and attention, its settlements, the Settle form while it is active, sent with the
     * revision on screen to the registered settle route, and Share.
     */
    private function detailsOf(DocumentView $document, DraftState $editing, string $label): LayoutPartData
    {
        $settlements = array_map(fn ($settlement) => new LayoutRowData(
            $settlement->settledAt,
            "Settled {$settlement->settledAt} by {$settlement->actorType} {$settlement->actorId}",
            $settlement->reason,
        ), $this->documents->inspect((int) $document->number)->settlements);

        $parts = [
            LayoutPartData::collection('facts', 'facts', [
                new LayoutRowData('editing', 'Editing', $editing->state->word($this->holderOf($editing))),
                new LayoutRowData('attention', 'Attention', $document->attention->value),
            ]),
        ];

        if ($settlements !== []) {
            $parts[] = LayoutPartData::collection('settlements', 'list', $settlements);
        }

        if ($document->attention === AttentionState::Active) {
            $parts[] = LayoutPartData::form(
                'settle',
                new LayoutFormData(
                    ActionMethod::Post,
                    route('documents.settle-document', ['document' => $document->number], false),
                    ['revision' => (int) $document->revision],
                ),
                'inline',
                LayoutPartData::field('reason', 'Reason', new LayoutFieldData('reason'), 'text'),
                LayoutPartData::action('send', 'Settle', LayoutActionData::submitting()),
            );
        }

        $share = RecordSharePartData::from(['reference' => $label]);
        $parts[] = LayoutPartData::native('share', LayoutNativeData::of('documents/RecordShare', $share));

        return LayoutPartData::box('details', 'stack', ...$parts);
    }

    /**
     * The first page of the document's revisions, each a row linking to that revision's own page.
     */
    private function historyOf(int $number): LayoutPartData
    {
        return LayoutPartData::collection('history', 'list', array_map(
            fn (RevisionCard $revision) => new LayoutRowData(
                $revision->number,
                "revision {$revision->number}",
                $revision->title,
                detail: $revision->closedAt,
                href: "/documents/docs/{$number}/revisions/{$revision->number}",
            ),
            $this->documents->revisions($number, 1),
        ));
    }

    private function holderOf(DraftState $editing): string
    {
        return $editing->holder instanceof Optional ? 'someone else' : $editing->holder;
    }
}
