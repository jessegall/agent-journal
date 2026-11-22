<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Support\RecordReference;
use Domain\Documents\Concerns\RefusesOtherDrafts;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Values\DraftReference;
use Domain\Documents\Values\DraftTarget;

/**
 * The one flow every draft edit follows: lock the document, find this editor's draft by its token, check the
 * version, change the text and save it as the next version.
 */
final readonly class DraftEditing
{
    use RefusesOtherDrafts;

    public function __construct(private RequestEditor $editors) {}

    /**
     * @param  callable(DraftText): DraftText  $newText  the draft's text after the edit
     */
    public function saveEdit(DraftTarget $target, callable $newText): DraftReference
    {
        if ($target->expectedVersion === null) {
            throw DraftConflict::withoutVersion();
        }

        $document = Document::lockedForEditing(RecordReference::idOrNumber($target->documentNumber));

        $draft = DocumentDraft::query()->where('document_id', $document->id)->where('token', $target->token)->firstOr(
            fn () => throw DraftMissing::forDocument($document->number),
        );

        $this->assertDraftEditor($draft, $this->editors);
        $this->assertCurrentDraftVersion($draft, $target->expectedVersion);
        $draft->saveText($newText(DraftText::of($draft)));

        return $draft->reference($document);
    }
}
