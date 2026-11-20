<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Agents\Contracts\SessionProvenance;
use App\Numbers\Support\RecordReference;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\Events\DocumentOpened;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Handlers\Support\DocumentCommandHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\RequestEditor;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class OpenDocumentHandler extends DocumentCommandHandler
{
    public function __construct(
        private RequestEditor $editors,
        private Dispatcher $events,
        private SessionProvenance $provenance,
    ) {}

    public function handle(OpenDocument $command): DraftReference
    {
        $document = Document::lockedForEditing(RecordReference::idOrNumber($command->documentNumber));

        if ($command->expectedRevision !== null) {
            $this->assertDocumentRevision($document, $command->expectedRevision);
        }

        $baseRevision = $document->currentRevisionOrFail();

        $editor = $this->editors->editor();
        $held = DocumentDraft::query()->where('document_id', $document->id)->first();

        if ($held !== null) {
            if (! $this->editors->isEditing($held)) {
                throw DraftHeld::byOther($held->holderLabel());
            }

            return $held->reference($document);
        }

        $otherDocumentDraft = DocumentDraft::query()->with('document')->where(
            'author_type',
            $editor->type->value,
        )->where('author_id', $editor->id)->first();

        if ($otherDocumentDraft !== null) {
            throw DraftHeld::elsewhere($otherDocumentDraft->document->number);
        }

        $draft = DocumentDraft::openFor($document, $baseRevision, $editor);
        $this->provenance->record($draft);
        $this->events->dispatch(new DocumentOpened($document->id, $document->number));

        return $draft->reference($document);
    }
}
