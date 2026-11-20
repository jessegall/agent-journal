<?php

declare(strict_types=1);

namespace App\Engine\Handlers;

use App\Contracts\CommandHandler;
use App\Engine\Commands\SettleFrameTimes;
use App\Engine\Models\EngineFrameTime;
use App\Engine\Support\EngineAccess;

/**
 * Checks the engine may address every settled frame's stack, then writes all their checkpoints in one statement,
 * without a stack lock.
 */
final readonly class SettleFrameTimesHandler implements CommandHandler
{
    public function __construct(private EngineAccess $access) {}

    public function handle(SettleFrameTimes $command): void
    {
        if ($command->settlements === []) {
            return;
        }

        foreach ($command->settlements as $settlement) {
            $this->access->assertTargetOrMaintenanceGranted($settlement->target, SettleFrameTimes::MAINTENANCE_SCOPE);
        }

        EngineFrameTime::recordMany($command->settlements);
    }
}
