<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Api\CloseResult;
use Domain\Documents\Commands\RecoverDocument;
use Domain\Documents\Handlers\Support\DocumentCommandHandler;
use Domain\Documents\Support\DraftClosing;

final readonly class RecoverDocumentHandler extends DocumentCommandHandler
{
    public function __construct(private DraftClosing $drafts) {}

    public function handle(RecoverDocument $command): CloseResult
    {

        return $this->drafts->recover($command->draft, $command->dispatchedBy(), $command->reason);
    }
}
