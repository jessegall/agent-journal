<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use Domain\Tasks\Models\Task;
use Illuminate\Container\Attributes\Scoped;

/**
 * Tasks as assignable records: every signed-in actor may see every task, and a task's work is over once it finished or
 * was cancelled.
 */
#[Scoped]
final readonly class TaskAssignments implements AssignableProvider
{
    public function __construct(private CurrentActor $actors) {}

    public function requireAssignable(RecordIdentity $record): Assignable
    {
        $this->actors->actor();

        return Task::query()->whereKey(
            $record->id,
        )->lock('for key share')->firstOr(RecordUnavailable::throwing()->for($record));
    }

    /**
     * @param  list<RecordIdentity>  $records
     * @return list<RecordIdentity>
     */
    public function visibleRecords(array $records): array
    {
        $this->actors->actor();

        $visibleTaskIds = Task::query()->whereKey(
            array_map(fn (RecordIdentity $record) => $record->id, $records),
        )->readExactly(count($records))->pluck('id')->all();

        return array_values(array_filter(
            $records,
            fn (RecordIdentity $record) => in_array($record->id, $visibleTaskIds, true),
        ));
    }

    /**
     * @param  list<Assignable>  $records
     * @return list<RecordIdentity>
     */
    public function finishedRecords(array $records): array
    {
        return array_values(array_map(
            fn (Task $task) => $task->assignmentIdentity(),
            array_filter($records, fn (Assignable $record) => $record instanceof Task && $record->status->hasEnded()),
        ));
    }
}
