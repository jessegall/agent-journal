<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Exceptions\AgentBusy;
use App\Exceptions\AgentNotAvailable;
use App\Exceptions\StartRefused;
use App\Support\ActorIdentity;

/**
 * Reserves an agent's next start inside the caller's transaction, before the caller checks its own facts about the
 * agent's work: a retirement and a competing start wait for the commit, and a busy or retired agent is refused.
 */
interface StartReservations
{
    /**
     * @throws AgentNotAvailable
     * @throws StartRefused
     * @throws AgentBusy
     */
    public function reserve(ActorIdentity $agent): void;

    /**
     * Whether the agent can never start again: it retired, or no longer exists. Retiring needs its process stopped
     * first, so a retired agent has exited.
     */
    public function hasRetired(ActorIdentity $agent): bool;
}
