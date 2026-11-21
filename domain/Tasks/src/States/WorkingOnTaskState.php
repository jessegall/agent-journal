<?php

declare(strict_types=1);

namespace Domain\Tasks\States;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Commands\FocusInstruction;
use App\Hooks\Commands\ReleaseInstruction;
use App\Hooks\Contracts\InstructsForeground;
use App\Hooks\Contracts\WorkRecordState;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\States\AgentState;
use App\Hooks\Values\LifecycleCommands;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskWork;

/**
 * The agent is working on a task: it may not stop while the task still needs work.
 */
final class WorkingOnTaskState extends AgentState implements InstructsForeground, WorkRecordState
{
    public function __construct(private readonly TaskWork $task) {}

    public function isFinished(): bool
    {
        return ! $this->task->needsWork();
    }

    public function workRecordType(): string
    {
        return Task::LINK_TYPE;
    }

    public function onEnter(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusInstruction());
    }

    public function onResume(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusInstruction());
    }

    public function onExit(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new ReleaseInstruction());
    }

    #[StackWide]
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->task->unfinishedReason());
    }

    public function instructionType(): string
    {
        return 'tasks.task';
    }

    public function instructionText(): string
    {
        return "Work on task {$this->task->number}, run {$this->task->runNumber}.";
    }
}
