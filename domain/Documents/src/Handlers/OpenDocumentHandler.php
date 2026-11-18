<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\Events\DocumentOpened;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Contracts\EditorContext;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class OpenDocumentHandler implements CommandHandler
{
    public function __construct(private EditorContext $editors, private Dispatcher $events) {}

    public function handle(OpenDocument $command): DraftReference
    {
        $document = Document::lockedForEditing($command->documentNumber);
        $editor = $this->editors->editor();
        $held = DocumentDraft::query()->where('document_id', $document->id)->first();

        if ($held !== null) {
            try {
                $held->requireEditor($editor);
            } catch (DraftConflict) {
                throw DraftHeld::byOther($held->holderLabel());
            }

            return $held->reference($document);
        }

        $elsewhere = DocumentDraft::query()->with('document')->where('author_type', $editor->type()->value)->where('author_id', $editor->id())->first();

        if ($elsewhere !== null) {
            throw DraftHeld::elsewhere($elsewhere->document->number);
        }

        $draft = DocumentDraft::openFor($document, $document->currentRevisionOrFail(), $editor);
        $this->events->dispatch(new DocumentOpened($document->id, $document->number));

        return $draft->reference($document);
    }
}
