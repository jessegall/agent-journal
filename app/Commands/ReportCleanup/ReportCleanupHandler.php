<?php

declare(strict_types=1);

namespace App\Commands\ReportCleanup;

use App\Contracts\CommandHandler;
use App\Enums\CleanupState;
use App\Models\CleanupOperation;
use App\Support\CapacityRelease;

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
