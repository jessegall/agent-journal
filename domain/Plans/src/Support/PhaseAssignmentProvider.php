<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Assignments\AssignableProvider;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Tasks\Contracts\TaskAssignmentResolver;
use Illuminate\Container\Attributes\Scoped;

/**
 * Phases as assignable records: every signed-in actor may see every phase, and a phase's work is over once it holds
 * tasks and every one of them ended; an empty phase is not over.
 */
#[Scoped]
final readonly class PhaseAssignmentProvider implements AssignableProvider
{
    public function __construct(
        private CurrentActor $actors,
        private TaskAssignmentResolver $tasks,
    ) {}

    public function requireAssignable(RecordIdentity $record): Assignable
    {
        $this->actors->actor();

        return Phase::query()->whereKey(
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

        $visiblePhaseIds = Phase::query()->whereKey(
            array_map(fn (RecordIdentity $record) => $record->id, $records),
        )->readExactly(count($records))->pluck('id')->all();

        return array_values(array_filter(
            $records,
            fn (RecordIdentity $record) => in_array($record->id, $visiblePhaseIds, true),
        ));
    }

    /**
     * The phases among the records whose tasks all ended, with every phase's tasks read in one query.
     *
     * @param  list<Assignable>  $records
     * @return list<RecordIdentity>
     */
    public function finishedRecords(array $records): array
    {
        $phaseIds = array_values(
            array_map(
                fn (Phase $phase) => $phase->id,
                array_filter($records, fn (Assignable $record) => $record instanceof Phase),
            ),
        );

        $taskGroups = array_fill_keys($phaseIds, []);

        $phaseTasks = PhaseTask::query()->ofPhases($phaseIds)->readAll('every task of the assigned phases')->orderBy('position')->get();

        foreach ($phaseTasks as $phaseTask) {
            $taskGroups[$phaseTask->phase_id][] = $phaseTask->task_id;
        }

        $completion = $this->tasks->completionOf($taskGroups);

        return array_values(array_map(
            fn (string $phaseId) => new RecordIdentity(Phase::linkType(), $phaseId),
            array_filter($phaseIds, fn (string $phaseId) => $completion[$phaseId]->isFinished()),
        ));
    }
}
