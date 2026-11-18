<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;

/**
 * Builds the state for a stored reference, reading its subject fresh for this request; it keeps nothing between calls.
 */
interface StateType
{
    /**
     * @throws StateSubjectMissing when the subject the reference names cannot be read
     */
    public function stateFor(StateReference $reference): AgentState;

    /**
     * The version of the stored reference this type reads.
     */
    public function schemaVersion(): int;
}
