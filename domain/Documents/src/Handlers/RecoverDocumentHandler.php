<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Commands\RecoverDocument;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Domain\Documents\Support\DraftClosing;

final readonly class RecoverDocumentHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration, private DraftClosing $drafts, private CurrentActor $actors) {}

    public function handle(RecoverDocument $command): CloseResult
    {
        $this->administration->authorize(DocumentAdministrationPolicy::class, Document::class, DocumentAbility::Administer);

        return $this->drafts->recover($command->draft, $this->actors->actor(), $command->reason);
    }
}
