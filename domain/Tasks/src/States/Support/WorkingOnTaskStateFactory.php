<?php

declare(strict_types=1);

namespace Domain\Tasks\States\Support;

use App\Hooks\Contracts\StateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;
use Domain\Tasks\Readers\Support\TaskRecords;
use Domain\Tasks\States\WorkingOnTaskState;

/**
 * Builds the working-on-task state from the task as it is now; it keeps no task between calls.
 */
final readonly class WorkingOnTaskStateFactory implements StateType
{
    public function __construct(private TaskRecords $tasks) {}

    public function statesFor(StateReferences $references): StateSet
    {
        $subjects = $this->tasks->many($references->subjectIds());

        return StateSet::build($references, function (StateReference $reference) use ($subjects): AgentState {
            $subject = $reference->subject;

            if (! $subject instanceof SubjectReference || ! isset($subjects[$subject->id])) {
                throw StateSubjectMissing::for($reference->typeKey);
            }

            return new WorkingOnTaskState($subjects[$subject->id]->workFor($subject->runNumber));
        });
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
