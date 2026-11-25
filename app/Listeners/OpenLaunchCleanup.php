<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionClosed;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\CapacityReservation;
use App\Models\Sessions\SessionCleanup;
use App\Support\CapacityRelease;

/**
 * Opens the durable cleanup of a container launch that ended, on the host it ran on; its capacity stays reserved
 * until that cleanup is done. A launch that never opened a runtime left nothing on a host, so its capacity is
 * released at once.
 */
#[InCommandTransaction]
final readonly class OpenLaunchCleanup implements Listener
{
    public function __construct(private CapacityRelease $capacity) {}

    public function handle(SessionClosed $event): void
    {
        $session = AgentSession::byId($event->sessionId);

        if (! CapacityReservation::isHeldFor($session->start_request_id)) {
            return;
        }

        $host = AgentRuntime::hostOfSession($session->id);

        if ($host->isEmpty()) {
            $this->capacity->releaseFor($session->start_request_id);

            return;
        }

        SessionCleanup::open($session, $host->get());
    }
}
