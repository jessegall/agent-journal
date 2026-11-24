<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Enums\FrameReuse;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use PhpOption\Option;
use PhpOption\Some;

/**
 * A pretend task state for hook tests: it works on one task of the in-memory tasks and is finished once that task is
 * no longer started.
 */
final class InMemoryTaskState extends AgentState
{
    public function __construct(private readonly int $number, private readonly int $runNumber, private readonly InMemoryTasks $tasks) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerSubject;
    }

    public function isFinished(): bool
    {
        return ! $this->tasks->isStarted($this->number);
    }

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return new Some("Work on task {$this->number}, run {$this->runNumber}.");
    }

    // ----------[ Hooks ]----------

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny("Task {$this->number} still needs work: finish it or record why it is blocked.");
    }
}
