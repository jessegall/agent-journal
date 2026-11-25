<?php

declare(strict_types=1);

namespace App\Commands\Sessions\NotifyCleanup;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Sessions\CleanupState;
use App\Models\Sessions\SessionCleanup;
use App\Support\CapacityRelease;

/**
 * Records the host's pass and releases the start's capacity once every transient resource is gone, since only
 * then can no process of it still run.
 */
final readonly class NotifyCleanupHandler implements CommandHandler
{
    public function __construct(private CapacityRelease $capacity) {}

    public function handle(NotifyCleanupCommand $command): CleanupState
    {
        $cleanup = SessionCleanup::findForSessionOn($command->hostId, $command->sessionId);
        $cleanup->recordPass($command->report);

        if ($cleanup->isDone()) {
            $this->capacity->releaseFor($cleanup->start_request_id);
        }

        return $cleanup->state;
    }
}
