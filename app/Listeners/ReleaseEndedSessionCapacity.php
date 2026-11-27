<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionClosed;
use App\Hosts\CapacityRelease;
use App\Models\Agents\AgentSession;

/**
 * An ended session gives its host capacity back at once; its container is removed by the host order the session's
 * end raises (RemoveEndedSessionContainer).
 */
#[InCommandTransaction]
final readonly class ReleaseEndedSessionCapacity implements Listener
{
    public function __construct(private CapacityRelease $capacity) {}

    public function handle(SessionClosed $event): void
    {
        $this->capacity->releaseFor(AgentSession::findById($event->sessionId)->start_request_id);
    }
}
