<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\States;

use App\Attributes\States\StateType;
use App\Enums\Engine\FrameReuse;
use App\Enums\Sessions\SessionTransferType;
use App\Events\Assignments\AssignmentsEnded;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\References\StateReference;
use App\Support\States\AgentState;
use App\Values\AgentText;
use Domain\Tasks\Commands\FocusTask\FocusTaskCommand;
use Domain\Tasks\Commands\UnfocusTask\UnfocusTaskCommand;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Events\TaskRunClaimed;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\States\Support\LogDueStateReference;
use Domain\Tasks\Support\States\Support\WorkOnTaskStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent working on one run of a task. The run stays open until the state hears the task finished, blocked or
 * cancelled, a newer run of it claimed, or the claim it holds ended; it keeps the claim it heard as its own, so a late
 * end of an earlier claim never closes a resumed run. A stop is held back while the run is open and held by this agent.
 * The task is in the agent's focus while its frame is the live top, and leaves it once the frame stops being live.
 */
#[StateType(WorkOnTaskStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class WorkOnTaskState extends AgentState
{
    /**
     * The tool uses after which a log on the task is due.
     */
    public const int LOG_DUE_AFTER = 30;

    private bool $isWorking = true;

    private int $toolUsesSinceLog = 0;

    private bool $isHeld = true;

    /**
     * The actor holding the run's claim, once the state heard it taken.
     */
    private string|null $holderId = null;

    /**
     * The claim's own assignment and those it stands on, as the last claim of this run was taken.
     *
     * @var list<string>
     */
    private array $claimAssignmentIds = [];

    public function __construct(
        private readonly string $taskId,
        private readonly int $number,
        private readonly int $runNumber,
    ) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerSubject;
    }

    public function isFinished(): bool
    {
        return ! $this->isWorking;
    }

    /**
     * @return Option<string>
     */
    public function workRecordType(): Option
    {
        return new Some(Task::linkType());
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some(AgentText::of('tasks.working_on', [
            'task' => $this->number,
            'run' => $this->runNumber,
        ]));
    }

    // ----------[ Lifecycle ]----------

    public function onEnter(): FocusTaskCommand
    {
        return new FocusTaskCommand($this->taskId);
    }

    public function onResume(): FocusTaskCommand
    {
        return new FocusTaskCommand($this->taskId);
    }

    public function onExit(): UnfocusTaskCommand
    {
        return new UnfocusTaskCommand($this->taskId);
    }

    // ----------[ Hooks ]----------

    public function onStop(StopRequested $input): Decision
    {
        $isHeldByThisAgent = $this->isHeld && ($this->holderId === null || $this->holderId === $input->hook->agentId);

        if (! $this->isWorking || ! $isHeldByThisAgent) {
            $this->isWorking = false;

            return Decision::delegate();
        }

        return Decision::deny(AgentText::of('tasks.unfinished', ['task' => $this->number]));
    }

    public function onToolFinished(ToolFinished $input): Decision|StateReference
    {
        $this->toolUsesSinceLog++;

        if ($this->toolUsesSinceLog < self::LOG_DUE_AFTER) {
            return Decision::delegate();
        }

        $this->toolUsesSinceLog = 0;

        return LogDueStateReference::forTask($this->taskId, $this->number);
    }

    // ----------[ Events ]----------

    public function onTaskFinished(TaskFinished $event): void
    {
        if ($event->taskId === $this->taskId) {
            $this->isWorking = false;
        }
    }

    public function onTaskBlocked(TaskBlocked $event): void
    {
        if ($event->taskId === $this->taskId) {
            $this->isWorking = false;
        }
    }

    public function onTaskCancelled(TaskCancelled $event): void
    {
        if ($event->taskId === $this->taskId) {
            $this->isWorking = false;
        }
    }

    public function onTaskLogged(TaskLogged $event): void
    {
        if ($event->taskId === $this->taskId) {
            $this->toolUsesSinceLog = 0;
        }
    }

    public function onTaskRunClaimed(TaskRunClaimed $event): void
    {
        if ($event->taskId !== $this->taskId) {
            return;
        }

        if ($event->runNumber !== $this->runNumber) {
            $this->isWorking = false;

            return;
        }

        $this->isHeld = true;
        $this->holderId = $event->holder->id;
        $this->claimAssignmentIds = $event->assignmentIds;
    }

    public function onAssignmentsEnded(AssignmentsEnded $event): void
    {
        if ($event->endsAnyOf($this->claimAssignmentIds)) {
            $this->isHeld = false;
        }
    }
}
