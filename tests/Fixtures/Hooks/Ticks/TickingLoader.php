<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Hooks\StateLoading\Contracts\TickableStateLoader;
use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\References\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\StateLoading\StateSet;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\States\AgentState;
use Closure;

/**
 * A ticking state type for tests that builds its states with a closure; other ticking fixtures extend it.
 */
class TickingLoader implements TickableStateLoader
{
    public readonly ScriptedOccurrenceGuard $guard;

    /**
     * @param  Closure(StateReference): AgentState  $make
     */
    public function __construct(private readonly Closure $make)
    {
        $this->guard = new ScriptedOccurrenceGuard();
    }

    public function stateClass(): string
    {
        return TickingState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference): AgentState => ($this->make)($reference));
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }

    public function occurrenceGuard(): WorkOccurrenceGuard
    {
        return $this->guard;
    }
}
