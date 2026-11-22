<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\WorkStates;

use App\Support\States\AgentState;
use PhpOption\Option;
use PhpOption\Some;

/**
 * A work state that names its work record but no instruction, which the work state contract check refuses.
 */
final class SilentWork extends AgentState
{
    /**
     * @return Option<string>
     */
    public function workRecordType(): Option
    {
        return new Some('fixture');
    }
}
