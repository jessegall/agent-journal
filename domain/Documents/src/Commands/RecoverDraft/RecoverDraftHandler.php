<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\RecoverDraft;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Resolvers\DraftReader;
use Domain\Documents\Support\DraftEditService;
use Domain\Documents\Values\DraftReference;
use Domain\Documents\Values\DraftTarget;

final readonly class RecoverDraftHandler extends DocumentCommandHandler
{
    public function __construct(
        private DraftReader $drafts,
        private DraftEditService $edits,
        private CommandBus $commands,
    ) {}

    public function handle(RecoverDraftCommand $command): DraftReference
    {
        $draft = $this->drafts->requireReadable($command->draftId);
        $document = Document::lockedForEditing($draft->document_id);
        $open = DocumentDraft::query()->ofDocument($document->id)->first();

        if ($open !== null) {
            throw DraftHeld::byOther($open->holderLabel);
        }

        $opened = $this->commands->run(new OpenDocumentCommand($document->id, $command->expectedRevision));
        $target = new DraftTarget($document->id, $opened->token, $opened->version);

        return $this->edits->saveEdit($target, fn () => $draft->workingText);
    }
}
