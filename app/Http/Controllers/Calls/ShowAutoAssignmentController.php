<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Assignments\ShowAutoAssignmentCall;
use App\Contracts\AutoAssignmentResolver;
use App\Data\Assignments\AutoAssignmentStatusData;

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
