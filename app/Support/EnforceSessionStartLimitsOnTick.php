<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Agents\EnforceSessionStartLimits\EnforceSessionStartLimitsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\Engine\EngineTicked;

/**
 * Enforces the start limits on every engine pass; each pass stops a bounded number of starts.
 */
final readonly class EnforceSessionStartLimitsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return EnforceSessionStartLimitsCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new EnforceSessionStartLimitsCommand());
    }
}
