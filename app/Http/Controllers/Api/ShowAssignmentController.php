<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Assignments\Api\ShowAssignmentPayload;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Data\RecordHolderData;

/**
 * Answers who holds one record.
 */
final readonly class ShowAssignmentController
{
    public function __invoke(ShowAssignmentPayload $call, AssigneeResolver $assignees): RecordHolderData
    {
        $record = $call->record();

        return RecordHolderData::of($record, $assignees->holdersOfRecords([$record])->forRecord($record));
    }
}
