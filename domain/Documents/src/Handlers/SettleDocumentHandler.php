<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Api\Events\RecordSettled;
use Domain\Documents\Commands\SettleDocument;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Handlers\Support\DocumentCommandHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\RecordChanges;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class SettleDocumentHandler extends DocumentCommandHandler
{
    public function __construct(private RecordChanges $changes, private Dispatcher $events) {}

    public function handle(SettleDocument $command): void
    {
        $document = Document::lockedForEditing($command->documentNumber);
        $this->assertDocumentRevision($document, $command->expectedRevision);

        if (DocumentDraft::query()->where('document_id', $document->id)->exists()) {
            throw SettlementDenied::beingEdited($document->number);
        }

        $this->changes->requireChangeOf($document);

        if ($document->settle($command->dispatchedBy(), $command->reason, $command->expectedRevision)) {
            $this->events->dispatch(new RecordSettled(Document::LINK_TYPE, $document->id));
        }
    }
}
