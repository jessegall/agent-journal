<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use Domain\Documents\Commands\DockReport;
use Domain\Documents\Support\Docking;

final readonly class DockReportHandler implements CommandHandler
{
    public function __construct(private Docking $docks) {}

    public function handle(DockReport $command): void
    {
        $this->docks->dockReport($command->reportNumber, $command->sessionId);
    }
}
