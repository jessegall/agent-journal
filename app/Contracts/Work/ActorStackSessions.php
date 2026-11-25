<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Support\ActorReference;

/**
 * The session stacks the operation of whoever acts in this request must be admitted to, from its type's provider.
 */
interface ActorStackSessions
{
    /**
     * @return list<string> session ids, sorted, so every operation admits them in one order
     */
    public function admittableSessions(): array;

    /**
     * The sessions an actor runs now, so work addressed to it reaches its stacks; none for an actor with no stack.
     *
     * @return list<string> session ids
     */
    public function sessionsOf(ActorReference $actor): array;
}
