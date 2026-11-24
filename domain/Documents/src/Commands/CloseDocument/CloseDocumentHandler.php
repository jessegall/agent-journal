<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CloseDocument;

use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Support\DraftCloseService;
use Domain\Documents\Values\CloseResult;

final readonly class CloseDocumentHandler extends DocumentCommandHandler
{
    public function __construct(private DraftCloseService $drafts) {}

    public function handle(CloseDocumentCommand $command): CloseResult
    {
        return $this->drafts->closeOwn($command->draft);
    }
}
