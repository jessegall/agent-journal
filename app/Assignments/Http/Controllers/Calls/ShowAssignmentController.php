<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\ShowAssignmentCall;
use App\Assignments\Contracts\AssigneeResolver;
use App\Http\Data\Assignments\RecordHolderData;

/**
 * Answers who holds one record.
 */
final readonly class ShowAssignmentController
{
    public function __invoke(ShowAssignmentCall $call, AssigneeResolver $assignees): RecordHolderData
    {
        $record = $call->record();

        return RecordHolderData::of($record, $assignees->holdersOfRecords([$record])->forRecord($record));
    }
}
