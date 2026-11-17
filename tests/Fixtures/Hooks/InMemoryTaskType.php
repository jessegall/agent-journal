<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Core\Hooks\Decisions\NoSubject;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\States\StateSubjectMissing;
use App\Core\Hooks\States\StateType;
use App\Domain\Tasks\States\WorkingOnTask;
use App\Domain\Tasks\TaskWork;
use App\Domain\Tasks\TaskWorkState;

/**
 * A task state type for tests that reads each task's state from a list the test can change between restores.
 */
final class InMemoryTaskType implements StateType
{
    /**
     * @param  array<int, TaskWorkState>  $tasks  task number to its current state
     */
    public function __construct(
        public array $tasks = [],
        private readonly int $version = 1,
    ) {}

    public function stateFor(StateReference $reference): AgentState
    {
        if ($reference->subject === NoSubject::None || ! isset($this->tasks[$reference->subject->id])) {
            throw StateSubjectMissing::for($reference);
        }

        $subject = $reference->subject;

        return new WorkingOnTask(new TaskWork($subject->id, $subject->runNumber, $this->tasks[$subject->id]));
    }

    public function schemaVersion(): int
    {
        return $this->version;
    }
}
