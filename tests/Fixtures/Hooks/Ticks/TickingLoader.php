<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\Contracts\TickableStateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
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

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference): AgentState => ($this->make)($reference));
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function occurrenceGuard(): WorkOccurrenceGuard
    {
        return $this->guard;
    }
}
