<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\WorkStates;

use App\Hooks\Contracts\WorkRecordState;
use App\Hooks\States\AgentState;

/**
 * A work state that neither instructs nor answers its lifecycle, which the work state contract check refuses.
 */
final class SilentWork extends AgentState implements WorkRecordState
{
    public function workRecordType(): string
    {
        return 'fixture';
    }
}
