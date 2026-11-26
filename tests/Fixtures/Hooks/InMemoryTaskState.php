<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Contracts\Work\UniqueSubjectState;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\RecordIdentity;
use App\Support\States\AgentState;
use App\Values\AgentText;
use PhpOption\Option;
use PhpOption\Some;
use Tests\Support\TestText;

/**
 * A pretend task state for hook tests: it works on one task of the in-memory tasks and is finished once that task is
 * no longer started.
 */
final class InMemoryTaskState extends AgentState implements UniqueSubjectState
{
    public function __construct(private readonly int $number, private readonly int $runNumber, private readonly InMemoryTasks $tasks) {}

    public function stateSubject(): RecordIdentity
    {
        return new RecordIdentity('tests.task', SubjectIds::of((string) $this->number));
    }

    public function isFinished(): bool
    {
        return ! $this->tasks->isStarted($this->number);
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some(TestText::of("Work on task {$this->number}, run {$this->runNumber}."));
    }

    // ----------[ Hooks ]----------

    public function onStop(StopRequested $input): Decision
    {
        $text = "Task {$this->number} still needs work: finish it or record why it is blocked.";

        return Decision::deny(TestText::of($text));
    }
}
