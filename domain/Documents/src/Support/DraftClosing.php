<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Actors\Contracts\Actor;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Api\Events\DocumentClosed;
use Domain\Documents\Api\Events\DocumentPublished;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Closes a draft under its document's lock, the one way every close goes: a close already recorded for the token
 * answers with its outcome, otherwise the draft at the expected version closes into a revision when it changed.
 */
final readonly class DraftClosing
{
    public function __construct(private RequestEditor $editors, private Dispatcher $events) {}

    /**
     * The editor closes their own draft.
     */
    public function closeOwn(DraftTarget $target): CloseResult
    {
        $requireEditor = fn (DocumentDraft $draft) => $draft->requireEditor($this->editors->editor());

        return $this->closeTarget($target, $requireEditor, CloseCause::Author, null, null);
    }

    /**
     * A user closes someone else's abandoned draft; the revision keeps the draft's author.
     */
    public function recover(DraftTarget $target, Actor $user, string $reason): CloseResult
    {
        return $this->closeTarget($target, fn () => null, CloseCause::Recovery, $user, $reason);
    }

    /**
     * Closes the draft of a session that ended, inside the transaction that ended it.
     */
    public function closeEnded(DocumentDraft $draft): void
    {
        $document = Document::lockedForEditing($draft->document->number);
        $this->closeLocked($document, $draft, CloseCause::Lifecycle, null, null);
    }

    /**
     * @param  callable(DocumentDraft): mixed  $requireCloser
     */
    private function closeTarget(
        DraftTarget $target,
        callable $requireCloser,
        CloseCause $cause,
        Actor|null $closer,
        string|null $reason,
    ): CloseResult {
        $document = Document::lockedForEditing($target->documentNumber);
        $closed = $document->closeOf($target->token);

        if ($closed !== null) {
            return $closed->result();
        }

        $draft = DocumentDraft::query()->where('document_id', $document->id)->where('token', $target->token)->first()
            ?? throw DraftMissing::forDocument($document->number);
        $requireCloser($draft);
        $draft->requireVersion($target->expectedVersion);

        return $this->closeLocked($document, $draft, $cause, $closer, $reason);
    }

    private function closeLocked(
        Document $document,
        DocumentDraft $draft,
        CloseCause $cause,
        Actor|null $closer,
        string|null $reason,
    ): CloseResult {
        $close = $draft->closeInto($document, $document->currentRevisionOrFail(), $cause, $closer, $reason);
        $this->events->dispatch(new DocumentClosed($document->id, $document->number, $close->result_revision_number));

        if ($close->published) {
            $this->events->dispatch(
                new DocumentPublished($document->id, $document->number, $close->result_revision_number),
            );
        }

        return $close->result();
    }
}
