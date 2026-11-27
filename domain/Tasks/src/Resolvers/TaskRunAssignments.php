<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use Domain\Tasks\Enums\TaskRunStatus;
use Domain\Tasks\Models\TaskRun;

/**
 * Task runs as internal responsibilities: Core's run claims assign them, and a finished run's work is over.
 */
final readonly class TaskRunAssignments implements AssignableProvider
{
    public function requireAssignable(RecordIdentity $record): Assignable
    {
        return TaskRun::query()->whereKey($record->id)->lock('for key share')->firstOr(
            RecordUnavailable::throwing()->for($record),
        );
    }

    public function visibleRecords(array $records): array
    {
        $visibleRunIds = TaskRun::query()
            ->whereKey(array_map(fn (RecordIdentity $record) => $record->id, $records))
            ->readExactlyOf($records)
            ->pluck('id')
            ->all();

        return array_values(array_filter(
            $records,
            fn (RecordIdentity $record) => in_array($record->id, $visibleRunIds, true),
        ));
    }

    public function finishedRecords(array $records): array
    {
        $finished = array_filter(
            $records,
            fn (Assignable $run) => $run instanceof TaskRun && $run->status === TaskRunStatus::Finished,
        );

        return array_values(array_map(fn (Assignable $run) => $run->assignmentIdentity(), $finished));
    }
}
