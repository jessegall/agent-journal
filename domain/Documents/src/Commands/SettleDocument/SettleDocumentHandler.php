<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\SettleDocument;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\RecordChangeGuard;
use Domain\Documents\Support\RecordSettler;

final readonly class SettleDocumentHandler extends DocumentCommandHandler
{
    public function __construct(private RecordChangeGuard $changes, private RecordSettler $settling) {}

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
