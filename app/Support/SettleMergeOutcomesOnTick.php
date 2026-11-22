<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\SettleMergeOutcomes\SettleMergeOutcomesCommand;
use App\Contracts\CommandBus;
use App\Contracts\EngineListener;
use App\Events\EngineTicked;

/**
 * Settles unsettled merge attempts on every engine pass; the sweep is bounded.
 */
final readonly class SettleMergeOutcomesOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return SettleMergeOutcomesCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new SettleMergeOutcomesCommand());
    }
}
