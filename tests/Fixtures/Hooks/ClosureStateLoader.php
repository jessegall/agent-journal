<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\States\AgentState;
use Closure;

/**
 * A state type for tests that builds its state with a closure.
 */
final readonly class ClosureStateLoader implements StateLoader
{
    /**
     * @param  class-string<AgentState>  $stateClass
     * @param  Closure(StateReference): AgentState  $make
     */
    public function __construct(private string $stateClass, private Closure $make) {}

    public function stateClass(): string
    {
        return $this->stateClass;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference) => $this->stateFor($reference));
    }

    private function stateFor(StateReference $reference): AgentState
    {
        return ($this->make)($reference);
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
