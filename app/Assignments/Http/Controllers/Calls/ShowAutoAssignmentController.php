<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\ShowAutoAssignmentCall;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Http\Data\Assignments\AutoAssignmentStatusData;

/**
 * Answers an auto-assignment's state.
 */
final readonly class ShowAutoAssignmentController
{
    public function __invoke(
        ShowAutoAssignmentCall $call,
        AutoAssignmentResolver $assignments,
    ): AutoAssignmentStatusData {
        return AutoAssignmentStatusData::of($assignments->status($call->key()));
    }
}
