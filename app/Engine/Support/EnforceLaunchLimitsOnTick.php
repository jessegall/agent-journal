<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Bus\Contracts\CommandBus;
use App\Engine\Commands\EnforceLaunchLimits\EnforceLaunchLimitsCommand;
use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;

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
