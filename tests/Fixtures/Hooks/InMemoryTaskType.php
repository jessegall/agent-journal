<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Contracts\StateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;
use Domain\Tasks\Enums\TaskWorkState;
use Domain\Tasks\States\WorkingOnTaskState;
use Domain\Tasks\Support\TaskWork;

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
            throw StateSubjectMissing::for($reference->typeKey);
        }

        $subject = $reference->subject;

        return new WorkingOnTaskState(new TaskWork($subject->id, $subject->runNumber, $this->tasks[$subject->id]));
    }

    public function schemaVersion(): int
    {
        return $this->version;
    }
}
