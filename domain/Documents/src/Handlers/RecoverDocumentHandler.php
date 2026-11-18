<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Actors\Contracts\CurrentActor;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Commands\RecoverDocument;
use Domain\Documents\Support\DraftClosing;

final readonly class RecoverDocumentHandler
{
    public function __construct(private DraftClosing $drafts, private CurrentActor $actors) {}

    public function handle(RecoverDocument $command): CloseResult
    {
        return $this->drafts->recover($command->draft, $this->actors->actor(), $command->reason);
    }
}
