<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\RecoverDocument;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Support\DraftClosing;
use Domain\Documents\Values\CloseResult;

final readonly class RecoverDocumentHandler extends DocumentCommandHandler
{
    public function __construct(private DraftClosing $drafts) {}

    public function handle(RecoverDocumentCommand $command): CloseResult
    {

        return $this->drafts->recover($command->draft, $command->dispatchedBy(), $command->reason);
    }
}
