<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Commands\HideDocumentDock;
use Domain\Documents\Support\Docking;

final readonly class HideDocumentDockHandler implements CommandHandler
{
    public function __construct(private Docking $docks) {}

    public function handle(HideDocumentDock $command): void
    {
        $this->docks->hideDocument($command->documentNumber, $command->sessionId);
    }
}
