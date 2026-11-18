<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use Domain\Documents\Commands\HideReportDock;
use Domain\Documents\Support\Docking;

final readonly class HideReportDockHandler
{
    public function __construct(private Docking $docks) {}

    public function handle(HideReportDock $command): void
    {
        $this->docks->hideReport($command->reportNumber, $command->sessionId);
    }
}
