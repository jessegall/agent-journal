<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Exceptions\StartRefused;

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
}
