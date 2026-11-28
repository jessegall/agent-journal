<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Documents;

use App\Data\Pages\RecordCard;
use App\Navigation\Contracts\RecordMenus;
use App\Sessions\Contracts\AgentDirectory;
use App\Settings\Enums\ActionMethod;
use App\Support\HomeAgent;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationTab;
use Closure;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Data\CommentList;
use Domain\Comments\Data\RecordCommentsPartData;
use Domain\Comments\Data\RecordReadsData;
use Domain\Documents\Data\DocumentCommentsPartData;
use Domain\Documents\Data\DocumentFeedbackPartData;
use Domain\Documents\Data\DocumentRecipientData;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\DraftEditorPartData;
use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordLinksPartData;
use Domain\Documents\Data\RecordSharePartData;
use Domain\Documents\Data\RecoverDraftPartData;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Enums\EditingStatus;
use Spatie\LaravelData\Optional;

/**
 * A document in the library's reader: its title, label, revision, actions and abstract, the editing part that stays
 * mounted across tabs, then the chosen tab: Text to comment on, History of revisions, Links, or Details with its
 * settlements, Settle and Share.
 */
final readonly class DocumentsShow extends DocumentsPage
{
    public function __construct(
        private RecordMenus $menus,
        private AgentDirectory $agents,
        private CommentResolver $comments,
    ) {}

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
                fn (HomeAgent $agent) => new DocumentRecipientData($agent->agentId, $agent->name),
                $this->agents->visible(),
            ),
            'address' => route('documents.ask-feedback', ['document' => $number], false),
        ]);

        return DetailPage::build()->title($document->title)->finish()
            ->above(LayoutPartData::build()
                ->asText()
                ->key('label')
                ->value("Doc {$number} · revision {$document->revision}")
                ->style('muted')
                ->finish())
            ->summarising($document->abstract)
            ->withActions(LayoutPartData::build()
                ->asMenu()
                ->key('actions')
                ->menu($this->menus->onRecord(DocumentsDomain::DOCUMENT_ACTIONS, (string) $number))
                ->finish())
            ->withStanding(...$this->feedbackOf($feedback), ...$this->editingOf($document, $editing))
            ->withTabs(
                PublicationTab::deferred(
                    'text',
                    'Text',
                    fn () => $this->textOf($document, $label, $feedback, $isPublic(), $comments(), $reads()),
                ),
                PublicationTab::deferred('history', 'History', fn () => $this->historyOf($number, $revisions())),
                PublicationTab::deferred('links', 'Links', fn () => LayoutPartData::build()
                    ->asNative()
                    ->key('links')
                    ->native(
                        LayoutNativeData::build()
                        ->component('documents/RecordLinks')
                        ->props(
                            RecordLinksPartData::from([
                                'source' => $label,
                                'links' => $links(),
                            ]),
                        )
                        ->finish(),
                    )
                    ->finish()),
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
            $parts[] = LayoutPartData::build()
                ->asNotice()
                ->key('public')
                ->style('info')
                ->title('This document is shared publicly: a comment you leave here will be public.')
                ->finish();
        }

        $lines = DocumentCommentsPartData::of(
            $document->revision,
            $label,
            $this->comments->commentAddress(),
            $document->body,
            $commentList,
            $feedback->recipients,
            $feedback->address,
        );

        $parts[] = LayoutPartData::build()
            ->asNative()
            ->key('lines')
            ->native(
                LayoutNativeData::build()->component('documents/DocumentComments')->props($lines)->finish(),
            )
            ->finish();

        $comments = RecordCommentsPartData::from([
            'comments' => $commentList,
            'target' => $label,
            'reads' => $reads,
            'version' => $document->revision,
        ]);

        $parts[] = LayoutPartData::build()
            ->asNative()
            ->key('comments')
            ->native(
                LayoutNativeData::build()->component('comments/RecordComments')->props($comments)->finish(),
            )
            ->finish();

        return LayoutPartData::build()->asBox()->key('text')->style('stack')->children(...$parts)->finish();
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

        return [LayoutPartData::build()
            ->asNative()
            ->key('feedback')
            ->native(
                LayoutNativeData::build()->component('documents/DocumentFeedback')->props($feedback)->finish(),
            )
            ->finish()];
    }

    /**
     * What the viewer may do with the draft: edit their own in the native editor, recover someone else's they may
     * recover, or see who else edits it; while nobody holds it, Edit in the actions menu opens it.
     *
     * @return list<LayoutPartData>
     */
    private function editingOf(DocumentView $document, DraftState $editing): array
    {
        if ($editing->status === EditingStatus::HeldByViewer && ! $editing->draft instanceof Optional) {
            $editor = DraftEditorPartData::from(['number' => $document->number, 'draft' => $editing->draft]);

            return [LayoutPartData::build()
                ->asNative()
                ->key('editing')
                ->native(
                    LayoutNativeData::build()->component('documents/DraftEditor')->props($editor)->finish(),
                )
                ->finish()];
        }

        if ($editing->status === EditingStatus::Held && ! $editing->held instanceof Optional) {
            $recovery = RecoverDraftPartData::from([
                'number' => $document->number,
                'holder' => $this->holderOf($editing),
                'held' => $editing->held,
            ]);

            return [LayoutPartData::build()
                ->asNative()
                ->key('editing')
                ->native(
                    LayoutNativeData::build()->component('documents/RecoverForm')->props($recovery)->finish(),
                )
                ->finish()];
        }

        if ($editing->status === EditingStatus::Held) {
            return [LayoutPartData::build()
                ->asNotice()
                ->key('editing')
                ->style('info')
                ->title("{$this->holderOf($editing)} is editing this document.")
                ->finish()];
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
            fn (SettlementCard $settlement) => LayoutRowData::build()
                ->key($settlement->settledAt)
                ->label("Settled {$settlement->settledAt} by {$settlement->actorType} {$settlement->actorId}")
                ->value($settlement->reason)
                ->finish(),
            $inspection->settlements,
        );

        $parts = [
            LayoutPartData::build()
                ->asCollection()
                ->key('facts')
                ->style('facts')
                ->rows(
                    [
                        LayoutRowData::build()
                            ->key('editing')
                            ->label('Editing')
                            ->value($editing->status->word($this->holderOf($editing)))
                            ->finish(),
                        LayoutRowData::build()
                            ->key('attention')
                            ->label('Attention')
                            ->value($document->attention->value)
                            ->finish(),
                    ],
                )
                ->finish(),
        ];

        if ($settlements !== []) {
            $parts[] = LayoutPartData::build()
                ->asCollection()
                ->key('settlements')
                ->style('list')
                ->rows($settlements)
                ->finish();
        }

        if ($document->attention === AttentionStatus::Active) {
            $parts[] = LayoutPartData::build()
                ->asForm()
                ->key('settle')
                ->form(
                    LayoutFormData::build()
                        ->method(ActionMethod::Post)
                        ->href(route('documents.settle-document', ['document' => $document->number], false))
                        ->fixed(['revision' => (int) $document->revision])
                        ->finish(),
                )
                ->style('inline')
                ->children(
                    LayoutPartData::build()
                    ->asField()
                    ->key('reason')
                    ->label('Reason')
                    ->field(LayoutFieldData::build()->name('reason')->finish())
                    ->style('text')
                    ->finish(),
                    LayoutPartData::build()
                    ->asAction()
                    ->key('send')
                    ->label('Settle')
                    ->action(LayoutActionData::build()->submits(true)->finish())
                    ->finish(),
                )
                ->finish();
        }

        $share = RecordSharePartData::from(['reference' => $label]);
        $parts[] = LayoutPartData::build()
            ->asNative()
            ->key('share')
            ->native(LayoutNativeData::build()->component('documents/RecordShare')->props($share)->finish())
            ->finish();

        return LayoutPartData::build()->asBox()->key('details')->style('stack')->children(...$parts)->finish();
    }

    /**
     * @param  list<RevisionCard>  $revisions
     */
    private function historyOf(int $number, array $revisions): LayoutPartData
    {
        return LayoutPartData::build()
            ->asCollection()
            ->key('history')
            ->style('list')
            ->rows(
                array_map(
                    fn (RevisionCard $revision) => LayoutRowData::build()
                        ->key($revision->number)
                        ->label("revision {$revision->number}")
                        ->value($revision->title)
                        ->detail($revision->closedAt)
                        ->href("/documents/docs/{$number}/revisions/{$revision->number}")
                        ->finish(),
                    $revisions,
                ),
            )
            ->finish();
    }

    private function holderOf(DraftState $editing): string
    {
        if ($editing->holder instanceof Optional) {
            return 'someone else';
        }

        return $editing->holder;
    }
}
