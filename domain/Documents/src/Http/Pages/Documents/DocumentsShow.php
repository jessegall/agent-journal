<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Documents;

use App\Contracts\Navigation\RecordMenus;
use App\Contracts\Sessions\AgentDirectory;
use App\Data\Comments\CommentList;
use App\Data\Pages\RecordCard;
use App\Enums\ActionMethod;
use App\Support\AgentOption;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationTab;
use Closure;
use Domain\Documents\Data\DocumentCommentsPartData;
use Domain\Documents\Data\DocumentFeedbackPartData;
use Domain\Documents\Data\DocumentRecipientData;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\DraftEditorPartData;
use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\RecordCommentsPartData;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordLinksPartData;
use Domain\Documents\Data\RecordReadsData;
use Domain\Documents\Data\RecordSharePartData;
use Domain\Documents\Data\RecoverDraftPartData;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Enums\EditingState;
use Spatie\LaravelData\Optional;

/**
 * A document in the library's reader, as a publication: its title, label, revision, actions menu and abstract; under them the editing
 * part, which stays mounted whichever tab is shown, so a held draft survives a tab change; then the tab the window
 * chose. Text is the numbered lines to comment on, the public-comment notice and the record's comments; History its revisions, each
 * linking to its own page; Links its linked records; Details its editing and attention, settlements, Settle and Share.
 */
final readonly class DocumentsShow extends DocumentsPage
{
    public function __construct(private RecordMenus $menus, private AgentDirectory $agents) {}

    /**
     * Each closure reads what one tab shows, only when that tab is chosen.
     *
     * @param  Closure(): bool  $isPublic  whether the document is shared publicly
     * @param  Closure(): CommentList  $comments
     * @param  Closure(): RecordReadsData  $reads
     * @param  Closure(): list<RecordCard>  $links
     * @param  Closure(): RecordInspection  $inspection
     * @param  Closure(): list<RevisionCard>  $revisions
     */
    public function of(
        DocumentView $document,
        DraftState $editing,
        string $tab,
        Closure $isPublic,
        Closure $comments,
        Closure $reads,
        Closure $links,
        Closure $inspection,
        Closure $revisions,
    ): LayoutPartData {
        $number = (int) $document->number;
        $label = "doc {$number}";
        $feedback = DocumentFeedbackPartData::from([
            'recipients' => array_map(
                fn (AgentOption $agent) => new DocumentRecipientData($agent->agentId, $agent->name),
                $this->agents->visible(),
            ),
            'address' => route('documents.ask-feedback', ['document' => $number], false),
        ]);

        return DetailPage::make($document->title)
            ->above(LayoutPartData::text('label', "Doc {$number} · revision {$document->revision}", 'muted'))
            ->summarising($document->abstract)
            ->withActions(LayoutPartData::menu(
                'actions',
                $this->menus->onRecord(DocumentsDomain::DOCUMENT_ACTIONS, (string) $number),
            ))
            ->withStanding(...$this->feedbackOf($feedback), ...$this->editingOf($document, $editing))
            ->withTabs(
                PublicationTab::deferred(
                    'text',
                    'Text',
                    fn () => $this->textOf($document, $label, $feedback, $isPublic(), $comments(), $reads()),
                ),
                PublicationTab::deferred('history', 'History', fn () => $this->historyOf($number, $revisions())),
                PublicationTab::deferred('links', 'Links', fn () => LayoutPartData::native(
                    'links',
                    LayoutNativeData::of('documents/RecordLinks', RecordLinksPartData::from([
                        'source' => $label,
                        'links' => $links(),
                    ])),
                )),
                PublicationTab::deferred(
                    'details',
                    'Details',
                    fn () => $this->detailsOf($document, $editing, $label, $inspection()),
                ),
            )
            ->part($tab);
    }

    private function textOf(
        DocumentView $document,
        string $label,
        DocumentFeedbackPartData $feedback,
        bool $isPublic,
        CommentList $commentList,
        RecordReadsData $reads,
    ): LayoutPartData {
        $parts = [];

        if ($isPublic) {
            $parts[] = LayoutPartData::notice(
                'public',
                'info',
                'This document is shared publicly: a comment you leave here will be public.',
            );
        }

        $lines = DocumentCommentsPartData::of(
            $document->revision,
            $label,
            $document->body,
            $commentList,
            $feedback->recipients,
            $feedback->address,
        );

        $parts[] = LayoutPartData::native('lines', LayoutNativeData::of('documents/DocumentComments', $lines));

        $comments = RecordCommentsPartData::from([
            'comments' => $commentList,
            'target' => $label,
            'reads' => $reads,
            'version' => $document->revision,
        ]);

        $parts[] = LayoutPartData::native('comments', LayoutNativeData::of('documents/RecordComments', $comments));

        return LayoutPartData::box('text', 'stack', ...$parts);
    }

    /**
     * Ask for feedback, while there is an agent to ask.
     *
     * @return list<LayoutPartData>
     */
    private function feedbackOf(DocumentFeedbackPartData $feedback): array
    {
        if ($feedback->recipients === []) {
            return [];
        }

        return [LayoutPartData::native('feedback', LayoutNativeData::of('documents/DocumentFeedback', $feedback))];
    }

    /**
     * What the viewer may do with the draft: edit their own in the native editor, recover someone else's they may
     * recover, or see who else edits it; while nobody holds it, Edit in the actions menu opens it.
     *
     * @return list<LayoutPartData>
     */
    private function editingOf(DocumentView $document, DraftState $editing): array
    {
        if ($editing->state === EditingState::HeldByViewer && ! $editing->draft instanceof Optional) {
            $editor = DraftEditorPartData::from(['number' => $document->number, 'draft' => $editing->draft]);

            return [LayoutPartData::native('editing', LayoutNativeData::of('documents/DraftEditor', $editor))];
        }

        if ($editing->state === EditingState::Held && ! $editing->held instanceof Optional) {
            $recovery = RecoverDraftPartData::from([
                'number' => $document->number,
                'holder' => $this->holderOf($editing),
                'held' => $editing->held,
            ]);

            return [LayoutPartData::native('editing', LayoutNativeData::of('documents/RecoverForm', $recovery))];
        }

        if ($editing->state === EditingState::Held) {
            return [LayoutPartData::notice('editing', 'info', "{$this->holderOf($editing)} is editing this document.")];
        }

        return [];
    }

    /**
     * The document's editing and attention, its settlements, the Settle form while it is active, sent with the
     * revision on screen to the registered settle route, and Share.
     */
    private function detailsOf(
        DocumentView $document,
        DraftState $editing,
        string $label,
        RecordInspection $inspection,
    ): LayoutPartData {
        $settlements = array_map(
            fn (SettlementCard $settlement) => LayoutRowData::from(
                [
                    'key' => $settlement->settledAt,
                    'label' => "Settled {$settlement->settledAt} by {$settlement->actorType} {$settlement->actorId}",
                    'value' => $settlement->reason,
                ],
            ),
            $inspection->settlements,
        );

        $parts = [
            LayoutPartData::collection('facts', 'facts', [
                LayoutRowData::from(
                    [
                        'key' => 'editing',
                        'label' => 'Editing',
                        'value' => $editing->state->word($this->holderOf($editing)),
                    ],
                ),
                LayoutRowData::from(
                    ['key' => 'attention', 'label' => 'Attention', 'value' => $document->attention->value],
                ),
            ]),
        ];

        if ($settlements !== []) {
            $parts[] = LayoutPartData::collection('settlements', 'list', $settlements);
        }

        if ($document->attention === AttentionState::Active) {
            $parts[] = LayoutPartData::form(
                'settle',
                LayoutFormData::from(
                    [
                        'method' => ActionMethod::Post,
                        'href' => route('documents.settle-document', ['document' => $document->number], false),
                        'fixed' => ['revision' => (int) $document->revision],
                    ],
                ),
                'inline',
                LayoutPartData::field('reason', 'Reason', LayoutFieldData::from(['name' => 'reason']), 'text'),
                LayoutPartData::action('send', 'Settle', LayoutActionData::submitting()),
            );
        }

        $share = RecordSharePartData::from(['reference' => $label]);
        $parts[] = LayoutPartData::native('share', LayoutNativeData::of('documents/RecordShare', $share));

        return LayoutPartData::box('details', 'stack', ...$parts);
    }

    /**
     * @param  list<RevisionCard>  $revisions
     */
    private function historyOf(int $number, array $revisions): LayoutPartData
    {
        return LayoutPartData::collection('history', 'list', array_map(
            fn (RevisionCard $revision) => LayoutRowData::from([
                'key' => $revision->number,
                'label' => "revision {$revision->number}",
                'value' => $revision->title,
                'detail' => $revision->closedAt,
                'href' => "/documents/docs/{$number}/revisions/{$revision->number}",
            ]),
            $revisions,
        ));
    }

    private function holderOf(DraftState $editing): string
    {
        return $editing->holder instanceof Optional ? 'someone else' : $editing->holder;
    }
}
