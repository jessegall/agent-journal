<?php

declare(strict_types=1);

namespace Domain\Tasks\States\Support;

use App\Hooks\Contracts\StateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Readers\Support\TaskRecords;
use Domain\Tasks\States\WorkingOnTaskState;

/**
 * Builds the working-on-task state from the task as it is now; it keeps no task between calls.
 */
final readonly class WorkingOnTaskStateFactory implements StateType
{
    public function __construct(private TaskRecords $tasks) {}

    public function stateFor(StateReference $reference): AgentState
    {
        $subject = $reference->subject;

        if (! $subject instanceof SubjectReference) {
            throw StateSubjectMissing::for($reference->typeKey);
        }

        try {
            $task = $this->tasks->get($subject->id);
        } catch (TaskMissing $missing) {
            throw StateSubjectMissing::for($reference->typeKey, $missing);
        }

        return new WorkingOnTaskState($task->workFor($subject->runNumber));
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
