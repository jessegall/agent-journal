<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Api\Events\DocumentDraftSaved;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * The one flow every draft edit follows: lock the document, find this editor's draft by its token, check the
 * version, change the text and save it as the next version.
 */
final readonly class DraftEditing
{
    public function __construct(private RequestEditor $editors, private Dispatcher $events) {}

    /**
     * @param  callable(DraftText): DraftText  $newText  the draft's text after the edit
     */
    public function saveEdit(DraftTarget $target, callable $newText): DraftReference
    {
        $document = Document::lockedForEditing($target->documentNumber);
        $draft = DocumentDraft::query()->where('document_id', $document->id)->where('token', $target->token)->first()
            ?? throw DraftMissing::forDocument($target->documentNumber);
        $draft->requireEditor($this->editors->editor());
        $draft->requireVersion($target->expectedVersion);
        $draft->saveText($newText(DraftText::of($draft)));
        $this->events->dispatch(new DocumentDraftSaved($document->id, $draft->version));

        return $draft->reference($document);
    }
}
