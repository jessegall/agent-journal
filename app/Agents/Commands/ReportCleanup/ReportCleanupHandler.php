<?php

declare(strict_types=1);

namespace App\Agents\Commands\ReportCleanup;

use App\Agents\Enums\CleanupState;
use App\Agents\Models\CleanupOperation;
use App\Agents\Support\CapacityRelease;
use App\Contracts\CommandHandler;

/**
 * Records the host's pass and releases the launch's capacity once every transient resource is gone, since only
 * then can no process of it still run.
 */
final readonly class ReportCleanupHandler implements CommandHandler
{
    public function __construct(private CapacityRelease $capacity) {}

    public function handle(ReportCleanupCommand $command): CleanupState
    {
        $cleanup = CleanupOperation::ofSessionOn($command->hostId, $command->sessionId);
        $cleanup->recordPass($command->report);

        if ($cleanup->isDone()) {
            $this->capacity->releaseFor($cleanup->start_request_id);
        }

        return $cleanup->state;
    }
}
