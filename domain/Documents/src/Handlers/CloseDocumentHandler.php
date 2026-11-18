<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\Events\DocumentClosed;
use Domain\Documents\Api\Events\DocumentPublished;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Contracts\EditorContext;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CloseDocumentHandler
{
    public function __construct(private EditorContext $editors, private Dispatcher $events) {}

    public function handle(CloseDocument $command): CloseResult
    {
        $document = Document::lockedForEditing($command->draft->documentNumber);
        $closed = DocumentClose::query()->where('token', $command->draft->token)->first();

        if ($closed !== null) {
            return $closed->result();
        }

        $draft = DocumentDraft::query()->where('document_id', $document->id)->where('token', $command->draft->token)->first()
            ?? throw DraftMissing::forDocument($document->number);
        $draft->requireEditor($this->editors->editor());
        $draft->requireVersion($command->draft->expectedVersion);
        $close = $draft->closeInto($document, $document->currentRevisionOrFail(), CloseCause::Author, null, null);

        $this->events->dispatch(new DocumentClosed($document->id, $document->number, $close->result_revision_number));

        if ($close->published) {
            $this->events->dispatch(new DocumentPublished($document->id, $document->number, $close->result_revision_number));
        }

        return $close->result();
    }
}
