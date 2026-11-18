<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;

/**
 * Builds the states for a batch of stored references of this type, reading their subjects fresh for this request in
 * one read; it keeps nothing between calls.
 */
interface StateType
{
    /**
     * A reference whose subject cannot be read keeps a StateSubjectMissing, thrown when its state is asked for.
     */
    public function statesFor(StateReferences $references): StateSet;

    /**
     * The version of the stored reference this type reads.
     */
    public function schemaVersion(): int;
}
