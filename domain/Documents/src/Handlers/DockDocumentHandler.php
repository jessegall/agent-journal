<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Commands\DockDocument;
use Domain\Documents\Support\Docking;

final readonly class DockDocumentHandler implements CommandHandler
{
    public function __construct(private Docking $docks) {}

    public function handle(DockDocument $command): void
    {
        $this->docks->dockDocument($command->documentNumber, $command->sessionId);
    }
}
