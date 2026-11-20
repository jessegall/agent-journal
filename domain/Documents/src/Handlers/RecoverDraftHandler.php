<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Commands\RecoverDraft;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Resolvers\RetainedDrafts;
use Domain\Documents\Support\DraftEditing;

final readonly class RecoverDraftHandler implements CommandHandler
{
    public function __construct(
        private RetainedDrafts $drafts,
        private DraftEditing $edits,
        private CommandBus $commands,
    ) {}

    public function handle(RecoverDraft $command): DraftReference
    {
        $draft = $this->drafts->requireReadable($command->draftId);
        $document = Document::lockedForEditing($draft->document_id);
        $open = DocumentDraft::query()->where('document_id', $document->id)->first();

        if ($open !== null) {
            throw DraftHeld::byOther($open->holderLabel());
        }

        $opened = $this->commands->run(new OpenDocument($document->id, $command->expectedRevision));
        $target = new DraftTarget($document->id, $opened->token, $opened->version);

        return $this->edits->saveEdit($target, fn () => $draft->workingText());
    }
}
