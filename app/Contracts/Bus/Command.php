<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Support\ActorIdentity;

/**
 * A write someone asks the journal to make: a small readonly value its one handler carries out.
 *
 * @template TResult
 */
interface Command
{
    /**
     * The actor who dispatched this command, bound by the bus.
     */
    public function dispatchedBy(): ActorIdentity;

    /**
     * A copy of this command bound to the given dispatcher.
     */
    public function withDispatcher(ActorIdentity $dispatcher): static;
}
