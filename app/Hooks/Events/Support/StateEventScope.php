<?php

declare(strict_types=1);

namespace App\Hooks\Events\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Support\StackTarget;
use App\Contracts\Event;
use Closure;
use Illuminate\Container\Attributes\Scoped;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Holds the admitted audience and the active event dispatch for this request.
 */
#[Scoped]
final class StateEventScope
{
    /**
     * @var list<StateEventAudience>
     */
    private array $audiences = [];

    /**
     * @var list<StateEventDispatch>
     */
    private array $dispatches = [];

    public function __construct(private readonly CurrentActor $actors) {}

    /**
     * @template TResult
     * @param list<StackTarget> $targets
     * @param Closure(): TResult $work
     * @return TResult
     */
    public function admit(array $targets, Closure $work): mixed
    {
        $before = $this->audiences;
        $this->audiences = $this->audienceFor($targets);

        try {
            return $work();
        } finally {
            $this->audiences = $before;
        }
    }

    public function capture(Event $event): StateEventDispatch
    {
        $audience = $this->audiences[0] ?? null;

        if ($audience === null || ! $this->isCurrent($audience)) {
            return new StateEventDispatch($event, None::create());
        }

        return new StateEventDispatch($event, new Some($audience));
    }

    /**
     * @return Option<StateEventDispatch>
     */
    public function currentDispatch(): Option
    {
        return Option::fromNullable($this->dispatches[0] ?? null);
    }

    /**
     * @template TResult
     * @param Closure(): TResult $listeners
     * @return TResult
     */
    public function deliver(StateEventDispatch $dispatch, Closure $listeners): mixed
    {
        return $this->during([$dispatch], $listeners);
    }

    /**
     * @template TResult
     * @param Closure(): TResult $listeners
     * @return TResult
     */
    public function deliverWithoutScope(Closure $listeners): mixed
    {
        return $this->during([], $listeners);
    }

    /**
     * @template TResult
     * @param list<StateEventDispatch> $dispatches
     * @param Closure(): TResult $listeners
     * @return TResult
     */
    private function during(array $dispatches, Closure $listeners): mixed
    {
        $before = $this->dispatches;
        $this->dispatches = $dispatches;

        try {
            return $listeners();
        } finally {
            $this->dispatches = $before;
        }
    }

    /**
     * @param list<StackTarget> $targets
     * @return list<StateEventAudience>
     */
    private function audienceFor(array $targets): array
    {
        if ($targets === [] || ! $this->actors->hasActor()) {
            return [];
        }

        return [new StateEventAudience($this->actors->actor(), $this->actors->authority(), $targets)];
    }

    private function isCurrent(StateEventAudience $audience): bool
    {
        return $this->actors->hasActor()
            && $this->actors->actor() == $audience->actor
            && $this->actors->authority() === $audience->authority;
    }
}
