<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Agents\Commands\InspectMergeAttempts;
use App\Bus\Contracts\CommandBus;
use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;

/**
 * Inspects interrupted merge attempts on every engine pass; the sweep is bounded.
 */
final readonly class InspectMergeAttemptsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return InspectMergeAttempts::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new InspectMergeAttempts());
    }
}
