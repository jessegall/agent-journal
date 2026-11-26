<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\OpenDocument;

use App\Sessions\Contracts\SessionProvenance;
use App\Support\RecordReference;
use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Support\RequestEditor;
use Domain\Documents\Values\DraftReference;

final readonly class OpenDocumentHandler extends DocumentCommandHandler
{
    public function __construct(
        private RequestEditor $editors,
        private SessionProvenance $provenance,
    ) {}

    public function handle(OpenDocumentCommand $command): DraftReference
    {
        $document = Document::findLockedForEditing(RecordReference::idOrNumber($command->documentNumber));

        if ($command->expectedRevision !== null) {
            $this->assertDocumentRevision($document, $command->expectedRevision);
        }

        $baseRevision = DocumentRevision::findCurrentOf($document);

        $editor = $this->editors->editor();
        $held = DocumentDraft::query()->ofDocument($document->id)->first();

        if ($held !== null) {
            if (! $this->editors->isEditing($held)) {
                throw DraftHeld::byOther($held->holderLabel);
            }

            return $held->reference($document);
        }

        $otherDocumentDraft = DocumentDraft::query()->withDocument()->withAuthorType(
            $editor->type,
        )->ofAuthor($editor->id)->first();

        if ($otherDocumentDraft !== null) {
            throw DraftHeld::elsewhere($otherDocumentDraft->document->number);
        }

        $draft = DocumentDraft::create($document, $baseRevision, $editor);
        $this->provenance->record($draft);

        return $draft->reference($document);
    }
}
