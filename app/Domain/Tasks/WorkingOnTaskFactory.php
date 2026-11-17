<?php

declare(strict_types=1);

namespace App\Domain\Tasks;

use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Exceptions\StateSubjectMissing;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\States\StateType;
use App\Domain\Tasks\Exceptions\TaskMissing;
use App\Domain\Tasks\States\WorkingOnTask;

/**
 * Builds the working-on-task state from the task as it is now; it keeps no task between calls.
 */
final readonly class WorkingOnTaskFactory implements StateType
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

        return new WorkingOnTask($task->workFor($subject->runNumber));
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
