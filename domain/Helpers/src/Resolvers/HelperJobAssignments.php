<?php

declare(strict_types=1);

namespace Domain\Helpers\Resolvers;

use App\Contracts\Assignments\Assignable;
use App\Contracts\Assignments\AssignableProvider;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use Domain\Helpers\Models\HelperJob;

/**
 * Helper jobs as internal responsibilities: a dispatch assigns each job to its helper actor, only the parent's own
 * jobs are visible, and a job in a final state is finished work.
 */
final readonly class HelperJobAssignments implements AssignableProvider
{
    public function requireAssignable(RecordIdentity $record): Assignable
    {
        return HelperJob::query()->whereKey($record->id)->lock('for key share')->firstOr(
            fn () => throw RecordUnavailable::for($record),
        );
    }

    public function visibleRecords(array $records): array
    {
        $visibleJobIds = HelperJob::query()
            ->whereKey(array_map(fn (RecordIdentity $record) => $record->id, $records))
            ->readExactly(count($records))
            ->pluck('id')
            ->all();

        return array_values(array_filter(
            $records,
            fn (RecordIdentity $record) => in_array($record->id, $visibleJobIds, true),
        ));
    }

    public function finishedRecords(array $records): array
    {
        $finished = array_filter(
            $records,
            fn (Assignable $job) => $job instanceof HelperJob && $job->isFinished(),
        );

        return array_values(array_map(fn (Assignable $job) => $job->assignmentIdentity(), $finished));
    }
}
