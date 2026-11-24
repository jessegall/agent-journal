<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Messages\SettleDispatchedBatches\SettleDispatchedBatchesCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\Engine\EngineTicked;

/**
 * Settles dispatched message batches on every engine pass; the sweep is bounded, so it needs no throttle.
 */
final readonly class SettleDispatchedBatchesOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return SettleDispatchedBatchesCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new SettleDispatchedBatchesCommand());
    }
}
