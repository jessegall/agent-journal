<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\SettleDocument;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\RecordChanges;
use Domain\Documents\Support\RecordSettlementService;

final readonly class SettleDocumentHandler extends DocumentCommandHandler
{
    public function __construct(private RecordChanges $changes, private RecordSettlementService $settling) {}

    public function handle(SettleDocumentCommand $command): void
    {
        $document = Document::findLockedForEditing($command->documentNumber);
        $this->assertDocumentRevision($document, $command->expectedRevision);

        if (DocumentDraft::query()->ofDocument($document->id)->exists()) {
            throw SettlementDenied::beingEdited($document->number);
        }

        $this->changes->requireChangeOf($document);

        $this->settling->settle($document, $command->dispatchedBy(), $command->reason, $command->expectedRevision);
    }
}
