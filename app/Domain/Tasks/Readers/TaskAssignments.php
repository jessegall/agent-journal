<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Readers;

use App\Core\Actors\Contracts\CurrentActor;
use App\Core\Assignments\Contracts\Assignable;
use App\Core\Assignments\Contracts\AssignableProvider;
use App\Core\Assignments\Exceptions\RecordUnavailable;
use App\Core\Assignments\Support\RecordIdentity;
use App\Domain\Tasks\Models\Task;
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

        return Task::query()->whereKey($record->id)->lock('for key share')->first() ?? throw RecordUnavailable::for($record);
    }

    /**
     * @param  list<RecordIdentity>  $records
     * @return list<RecordIdentity>
     */
    public function visibleRecords(array $records): array
    {
        $this->actors->actor();
        $found = Task::query()->whereKey(array_map(fn (RecordIdentity $record) => $record->id, $records))->pluck('id')->all();

        return array_values(array_filter($records, fn (RecordIdentity $record) => in_array($record->id, $found, true)));
    }

    /**
     * @param  list<Assignable>  $records
     * @return list<RecordIdentity>
     */
    public function finishedRecords(array $records): array
    {
        return array_values(array_map(
            fn (Task $task) => $task->assignmentIdentity(),
            array_filter($records, fn (Assignable $record) => $record instanceof Task && $record->state->hasEnded()),
        ));
    }
}
