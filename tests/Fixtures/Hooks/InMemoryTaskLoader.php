<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\References\StateReference;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\StateSet;
use App\Enums\NoSubject;
use App\Enums\SessionTransferType;
use App\Exceptions\StateSubjectMissing;
use App\Support\States\AgentState;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Support\States\WorkingOnTaskState;
use Domain\Tasks\Support\TaskWork;

/**
 * A task state type for tests that reads each task's state from a list the test can change between restores.
 */
final class InMemoryTaskLoader implements StateLoader
{
    /**
     * @param  array<int, TaskState>  $tasks  task number to its current state
     */
    public function __construct(
        public array $tasks = [],
        private readonly int $version = 1,
    ) {}

    public function stateClass(): string
    {
        return WorkingOnTaskState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference) => $this->stateFor($reference));
    }

    private function stateFor(StateReference $reference): AgentState
    {
        if ($reference->subject === NoSubject::None || ! isset($this->tasks[$reference->subject->id])) {
            throw StateSubjectMissing::for($reference->typeKey);
        }

        $subject = $reference->subject;

        return new WorkingOnTaskState(
new TaskWork((int) $subject->id, $subject->runNumber, $this->tasks[$subject->id]),
);
    }

    public function schemaVersion(): int
    {
        return $this->version;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }
}
