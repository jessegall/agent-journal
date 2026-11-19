<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Support\ActorContext;
use App\Bus\Contracts\Command as CommandContract;
use App\Bus\Exceptions\CommandDispatcherMissing;

/**
 * The shared base of every bus command: it carries the actor the bus bound as its dispatcher.
 *
 * @template TResult
 *
 * @implements CommandContract<TResult>
 */
abstract readonly class Command implements CommandContract
{
    /** @phpstan-ignore property.uninitializedReadonly (bound later by withDispatcher through clone-with) */
    private ActorContext $dispatchingActor;

    /**
     * The actor who dispatched this command; fails while the bus has not bound one.
     */
    final public function dispatchedBy(): ActorContext
    {
        if (! isset($this->dispatchingActor)) {
            throw CommandDispatcherMissing::forCommand(static::class);
        }

        return $this->dispatchingActor;
    }

    /**
     * A copy of this command bound to exactly the given dispatcher.
     */
    final public function withDispatcher(ActorContext $dispatcher): static
    {
        return clone ($this, [
            'dispatchingActor' => $dispatcher,
        ]);
    }
}
