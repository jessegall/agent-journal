<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Commands\HideReportDock;
use Domain\Documents\Support\Docking;

final readonly class HideReportDockHandler implements CommandHandler
{
    public function __construct(private Docking $docks) {}

    public function handle(HideReportDock $command): void
    {
        $this->docks->hideReport($command->reportNumber, $command->sessionId);
    }
}
