<?php

declare(strict_types=1);

namespace App\Access\StateEvents;

use App\Contracts\Events\Event;
use App\Exceptions\StackTargetRefused;
use App\Values\StackTarget;
use Illuminate\Support\Str;
use PhpOption\Option;

/**
 * One dispatch of an application event and the scope it captured.
 */
final readonly class StateEventDispatch
{
    public string $id;

    /**
     * @param  Option<StateEventAudience>  $audience
     * @param  list<StackTarget>  $listening  the stacks the fact reaches because one of their states listens for it
     */
    public function __construct(
        public Event $event,
        public Option $audience,
        public bool $isAfterCommit = false,
        public array $listening = [],
    ) {
        $this->id = (string) Str::ulid();
    }

    public function scheduledAfterCommit(): self
    {
        return clone ($this, ['isAfterCommit' => true]);
    }

    /**
     * The same dispatch reaching also the listening stacks the caller did not admit.
     *
     * @param  list<StackTarget>  $listening
     */
    public function withListening(array $listening): self
    {
        $unadmitted = array_values(array_filter($listening, fn (StackTarget $target) => ! $this->admits($target)));

        return clone ($this, ['listening' => $unadmitted]);
    }

    /**
     * Every stack the fact reaches: the admitted ones, then the listening ones.
     *
     * @return list<StackTarget>
     */
    public function targets(): array
    {
        $admitted = $this->audience->map(fn (StateEventAudience $audience) => $audience->targets)->getOrElse([]);

        return [
            ...$admitted,
            ...$this->listening,
        ];
    }

    /**
     * Whether the caller admitted the stack, so what its states answer runs under the caller.
     */
    public function admits(StackTarget $target): bool
    {
        return $this->audience
            ->filter(fn (StateEventAudience $audience) => $audience->allowsTarget($target))
            ->isDefined();
    }

    public function assertTargetGranted(StackTarget $target): void
    {
        $listens = array_any($this->listening, fn (StackTarget $listening) => $listening->isSameAs($target));

        if (! $this->admits($target) && ! $listens) {
            throw StackTargetRefused::forTarget($target->description());
        }
    }
}
