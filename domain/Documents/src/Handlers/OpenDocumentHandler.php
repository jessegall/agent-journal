<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Agents\Contracts\SessionProvenance;
use App\Contracts\CommandHandler;
use App\Numbers\Support\RecordReference;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\Events\DocumentOpened;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\RequestEditor;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class OpenDocumentHandler implements CommandHandler
{
    public function __construct(
        private RequestEditor $editors,
        private Dispatcher $events,
        private SessionProvenance $provenance,
    ) {}

    public function handle(OpenDocument $command): DraftReference
    {
        $document = Document::lockedForEditing(RecordReference::idOrNumber($command->documentNumber));
        $base = $document->currentRevisionOrFail();
        if ($command->expectedRevision !== null && $base->number !== $command->expectedRevision) {
            throw StaleRead::revision($command->expectedRevision, $base->number);
        }

        $editor = $this->editors->editor();
        $held = DocumentDraft::query()->where('document_id', $document->id)->first();

        if ($held !== null) {
            if (! $this->editors->isEditing($held)) {
                throw DraftHeld::byOther($held->holderLabel());
            }

            return $held->reference($document);
        }

        $elsewhere = DocumentDraft::query()->with('document')->where(
            'author_type',
            $editor->type->value,
        )->where('author_id', $editor->id)->first();

        if ($elsewhere !== null) {
            throw DraftHeld::elsewhere($elsewhere->document->number);
        }

        $draft = DocumentDraft::openFor($document, $base, $editor);
        $this->provenance->record($draft);
        $this->events->dispatch(new DocumentOpened($document->id, $document->number));

        return $draft->reference($document);
    }
}
