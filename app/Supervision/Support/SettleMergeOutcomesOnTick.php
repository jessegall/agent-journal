<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Bus\Contracts\CommandBus;
use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;
use App\Supervision\Commands\SettleMergeOutcomes;

/**
 * Settles unsettled merge attempts on every engine pass; the sweep is bounded.
 */
final readonly class SettleMergeOutcomesOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return SettleMergeOutcomes::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new SettleMergeOutcomes());
    }
}
