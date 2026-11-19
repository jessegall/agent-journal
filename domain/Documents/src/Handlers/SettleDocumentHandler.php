<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Api\Events\RecordSettled;
use Domain\Documents\Commands\SettleDocument;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Support\RecordChanges;
use Domain\Documents\Support\RecordFields;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class SettleDocumentHandler implements CommandHandler
{
    public function __construct(private RecordChanges $changes, private Dispatcher $events) {}

    public function handle(SettleDocument $command): void
    {
        $reason = RecordFields::settlementReason($command->reason);
        $document = Document::lockedForEditing($command->documentNumber);
        $current = $document->currentRevisionOrFail()->number;

        if ($current !== $command->expectedRevision) {
            throw StaleRead::revision($command->expectedRevision, $current);
        }

        if (DocumentDraft::query()->where('document_id', $document->id)->exists()) {
            throw SettlementDenied::beingEdited($document->number);
        }

        $this->changes->requireChangeOf($document);

        if ($document->settle($command->dispatchedBy(), $reason, $current)) {
            $this->events->dispatch(new RecordSettled(Document::LINK_TYPE, $document->id));
        }
    }
}
