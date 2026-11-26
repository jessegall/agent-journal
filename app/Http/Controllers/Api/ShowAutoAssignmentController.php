<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Assignments\Api\ShowAutoAssignmentPayload;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Data\AutoAssignmentStatusData;

/**
 * Answers an auto-assignment's state.
 */
final readonly class ShowAutoAssignmentController
{
    public function __invoke(
        ShowAutoAssignmentPayload $call,
        AutoAssignmentResolver $assignments,
    ): AutoAssignmentStatusData {
        return AutoAssignmentStatusData::of($assignments->status($call->key()));
    }
}
