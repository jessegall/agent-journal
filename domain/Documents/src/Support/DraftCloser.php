<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Actors\Contracts\Actor;
use App\Sessions\Contracts\SessionProvenance;
use Domain\Documents\Concerns\RefusesOtherDrafts;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Exceptions\DraftMarkdownInvalid;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\RetainedDraft;
use Domain\Documents\Values\CloseResult;
use Domain\Documents\Values\DraftTarget;

/**
 * Closes a draft under its document's lock, the one way every close goes: a close already recorded for the token
 * answers with its outcome, otherwise the draft at the expected version closes into a revision when it changed. The
 * close record takes the final revision number from here, and each row raises its own fact.
 */
final readonly class DraftCloser
{
    use RefusesOtherDrafts;

    public function __construct(
        private RequestEditor $editors,
        private SessionProvenance $provenance,
    ) {}

    /**
     * The editor closes their own draft.
     */
    public function closeOwn(DraftTarget $target): CloseResult
    {
        $requireEditor = fn (DocumentDraft $draft) => $this->assertDraftEditor($draft, $this->editors);

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
        $document = Document::findLockedForEditing($draft->document->number);
        $held = DocumentDraft::query()->find($draft->id);

        if ($held === null) {
            return;
        }

        try {
            $this->closeLocked($document, $held, CloseCause::Lifecycle, null, null);
        } catch (DraftMarkdownInvalid $invalid) {
            $kept = RetainedDraft::create($held, $invalid->getMessage(), $this->provenance->parentOf($held));
            $this->provenance->inherit($kept, $held);
            $held->delete();
        }
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
        $document = Document::findLockedForEditing($target->documentKey());
        $closed = $document->closeOf($target->token);

        if ($closed !== null) {
            return $closed->result;
        }

        $draft = DocumentDraft::query()->ofDocument($document->id)->withToken($target->token)->firstOr(
            DraftMissing::throwing()->forDocument($document->number),
        );

        $requireCloser($draft);

        if ($target->expectedVersion !== null) {
            $this->assertCurrentDraftVersion($draft, $target->expectedVersion);
        }

        return $this->closeLocked($document, $draft, $cause, $closer, $reason);
    }

    private function closeLocked(
        Document $document,
        DocumentDraft $draft,
        CloseCause $cause,
        Actor|null $closer,
        string|null $reason,
    ): CloseResult {
        MarkdownCheck::publication($draft->body);
        $base = DocumentRevision::findCurrentOf($document);

        if (! $draft->hasChangesFrom($base)) {
            $close = DocumentClose::create($document, $draft, $base->number, $cause, $closer, $reason, false);
            $draft->delete();

            return $close->result;
        }

        $revision = DocumentRevision::create(
            $document,
            $draft->title,
            $draft->abstract,
            $draft->body,
            $draft->author_type,
            $draft->author_id,
        );

        $close = DocumentClose::create($document, $draft, $revision->number, $cause, $closer, $reason, true);
        $document->publish($revision);
        $this->provenance->inherit($revision, $draft);
        $draft->delete();

        return $close->result;
    }
}
