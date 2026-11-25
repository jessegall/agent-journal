<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\ShowAssignmentPayload;
use App\Contracts\Assignments\AssigneeResolver;
use App\Data\Assignments\RecordHolderData;

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
