<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Api\CloseResult;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Handlers\Support\DocumentCommandHandler;
use Domain\Documents\Support\DraftClosing;

final readonly class CloseDocumentHandler extends DocumentCommandHandler
{
    public function __construct(private DraftClosing $drafts) {}

    public function handle(CloseDocument $command): CloseResult
    {
        return $this->drafts->closeOwn($command->draft);
    }
}
