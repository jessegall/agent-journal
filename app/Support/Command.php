<?php

declare(strict_types=1);

namespace App\Support;

use App\Bus\Contracts\Command as CommandContract;
use App\Exceptions\CommandDispatcherMissing;

/**
 * The shared base of every bus command: it carries the actor the bus bound as its dispatcher.
 *
 * @template TResult
 *
 * @implements CommandContract<TResult>
 */
abstract readonly class Command implements CommandContract
{
    /**
     * @phpstan-ignore property.uninitializedReadonly (bound later by withDispatcher through clone-with)
     */
    private ActorReference $dispatchingActor;

    /**
     * The actor who dispatched this command; fails while the bus has not bound one.
     */
    final public function dispatchedBy(): ActorReference
    {
        if (! isset($this->dispatchingActor)) {
            throw CommandDispatcherMissing::forCommand(static::class);
        }

        return $this->dispatchingActor;
    }

    /**
     * A copy of this command bound to exactly the given dispatcher.
     */
    final public function withDispatcher(ActorReference $dispatcher): static
    {
        return clone ($this, ['dispatchingActor' => $dispatcher]);
    }
}
