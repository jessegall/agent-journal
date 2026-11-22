<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\InspectMergeAttempts\InspectMergeAttemptsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\EngineTicked;

/**
 * Inspects interrupted merge attempts on every engine pass; the sweep is bounded.
 */
final readonly class InspectMergeAttemptsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return InspectMergeAttemptsCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new InspectMergeAttemptsCommand());
    }
}
