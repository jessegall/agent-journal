<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\States\AgentState;

/**
 * Loads the states of one state type: given a batch of stored references, it reads their subjects fresh for this
 * request in one read and builds their states; it keeps nothing between calls.
 */
interface StateLoader
{
    /**
     * @return class-string<AgentState> The state class, available without reading its subjects.
     */
    public function stateClass(): string;

    /**
     * A reference whose subject cannot be read keeps a StateSubjectMissing, thrown when its state is asked for.
     */
    public function statesFor(StateReferences $references): StateSet;

    /**
     * The version of the stored reference this loader reads.
     */
    public function schemaVersion(): int;
}
