<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\WorkStates;

use App\Contracts\Work\WorkState;
use App\Support\RecordIdentity;
use App\Support\States\AgentState;
use Tests\Fixtures\Hooks\SubjectIds;

/**
 * A work state with a work record but no instruction, which the work state contract check refuses.
 */
final class SilentWork extends AgentState implements WorkState
{
    public function stateSubject(): RecordIdentity
    {
        return new RecordIdentity('tests.work', SubjectIds::of('silent'));
    }
}
