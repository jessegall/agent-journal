<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Support\ActorReference;

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
    public function dispatchedBy(): ActorReference;

    /**
     * A copy of this command bound to the given dispatcher.
     */
    public function withDispatcher(ActorReference $dispatcher): static;
}
