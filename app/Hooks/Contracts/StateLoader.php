<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;

/**
 * Loads the states of one state type: given a batch of stored references, it reads their subjects fresh for this
 * request in one read and builds their states; it keeps nothing between calls.
 */
interface StateLoader
{
    /**
     * A reference whose subject cannot be read keeps a StateSubjectMissing, thrown when its state is asked for.
     */
    public function statesFor(StateReferences $references): StateSet;

    /**
     * The version of the stored reference this loader reads.
     */
    public function schemaVersion(): int;
}
