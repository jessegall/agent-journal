<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Work\RuntimeWorkers;
use App\Contracts\Events\Listener;
use App\Events\Sessions\StartIdentityBound;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionRequest;

/**
 * A start whose driver proved its conversation releases the messages held for it, and wakes the worker that sends
 * them, which otherwise sleeps until something else wakes it.
 */
final readonly class WakeWorkerForReleasedDeliveries implements Listener
{
    public function __construct(private RuntimeWorkers $workers) {}

    public function handle(StartIdentityBound $fact): void
    {
        $record = SessionRequest::query()->whereKey($fact->startId)->sole();
        $runtime = AgentRuntime::findForSession($record->session_id);

        // A start whose runtime ended meanwhile has no worker left to wake.
        if ($runtime !== null) {
            $this->workers->wake($runtime);
        }
    }
}
