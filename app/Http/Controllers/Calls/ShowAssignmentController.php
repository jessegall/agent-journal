<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Assignments\ShowAssignmentCall;
use App\Contracts\Assignments\AssigneeResolver;
use App\Data\Assignments\RecordHolderData;

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
