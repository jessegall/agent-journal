<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

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
    /**
     * @param  Closure(StateReference): AgentState  $make
     */
    public function __construct(private readonly Closure $make) {}

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference): AgentState => ($this->make)($reference));
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
