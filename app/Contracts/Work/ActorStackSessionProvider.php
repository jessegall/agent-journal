<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Support\ActorIdentity;

/**
 * What the owner of an actor type answers for stack admission: the session stacks the acting actor's operation must
 * be admitted to before its transaction opens; an actor that works on no stack has none.
 */
interface ActorStackSessionProvider
{
    /**
     * @return list<string> session ids
     */
    public function admittableSessions(): array;

    /**
     * The sessions an actor runs now, so work addressed to it reaches its stacks; none for an actor with no stack.
     *
     * @return list<string> session ids
     */
    public function sessionsOf(ActorIdentity $actor): array;
}
