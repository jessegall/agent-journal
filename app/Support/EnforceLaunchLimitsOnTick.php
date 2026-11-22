<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\EnforceLaunchLimits\EnforceLaunchLimitsCommand;
use App\Contracts\CommandBus;
use App\Contracts\EngineListener;
use App\Events\EngineTicked;

/**
 * Enforces the launch limits on every engine pass; each pass stops a bounded number of launches.
 */
final readonly class EnforceLaunchLimitsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return EnforceLaunchLimitsCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new EnforceLaunchLimitsCommand());
    }
}
