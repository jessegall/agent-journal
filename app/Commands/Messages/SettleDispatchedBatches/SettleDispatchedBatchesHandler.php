<?php

declare(strict_types=1);

namespace App\Commands\Messages\SettleDispatchedBatches;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Support\EngineAccess;
use App\Support\MessageBatchService;

/**
 * Settles dispatched batches only under the engine's grant; the sweep itself is bounded.
 */
final readonly class SettleDispatchedBatchesHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private ServerClock $clock,
        private MessageBatchService $batches,
    ) {}

    public function handle(SettleDispatchedBatchesCommand $command): void
    {
        $this->access->assertMaintenanceGranted(SettleDispatchedBatchesCommand::MAINTENANCE_SCOPE);
        $this->batches->sweep($this->clock->now());
    }
}
