<?php

declare(strict_types=1);

namespace Tests\Fixtures\Assignments\WriteBoundary;

use App\Assignments\Contracts\AssignmentWriter;
use App\Hooks\States\AgentState;

/**
 * A state that holds an assignment writer, which the assignment write check refuses.
 */
final class AssignsFromAState extends AgentState
{
    public function writerName(AssignmentWriter $writer): string
    {
        return $writer::class;
    }
}
