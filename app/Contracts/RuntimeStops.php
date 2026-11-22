<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActorIdentity;

/**
 * Asks the running sessions of an agent to stop, as a chain of reviewed work ends.
 */
interface RuntimeStops
{
    public function stopAgent(ActorIdentity $agent, string $idempotencyKey): void;
}
