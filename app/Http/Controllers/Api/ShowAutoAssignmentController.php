<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\ShowAutoAssignmentPayload;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Data\Assignments\AutoAssignmentStatusData;

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
