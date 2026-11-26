<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Support\ActorReference;

/**
 * Asks the running sessions of an agent to stop, as a chain of reviewed work ends.
 */
interface RuntimeStops
{
    /**
     * Stops the agent's running session, once per key.
     */
    public function stopAgent(ActorReference $agent, string $idempotencyKey): void;
}
