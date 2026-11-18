<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Contracts\StateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\States\AgentState;
use Closure;

/**
 * A state type for tests that builds its state with a closure.
 */
final readonly class ClosureStateType implements StateType
{
    /**
     * @param  Closure(StateReference): AgentState  $make
     */
    public function __construct(private Closure $make) {}

    public function stateFor(StateReference $reference): AgentState
    {
        return ($this->make)($reference);
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
