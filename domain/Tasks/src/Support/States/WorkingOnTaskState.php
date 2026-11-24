<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\States;

use App\Attributes\StateType;
use App\Contracts\Processes\RunClaims;
use App\Enums\FrameReuse;
use App\Enums\SessionTransferType;
use App\Support\ActorIdentity;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Resolvers\Support\TaskRecords;
use Domain\Tasks\Support\States\Support\WorkingOnTaskStateReference;
use Domain\Tasks\Support\TaskWork;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent working on one run of a task. The run stays open until the state hears the task finished, blocked or
 * cancelled; a stop is held back only while the run is still the task's current one, started and held by this agent,
 * which the state asks once, at the stop.
 */
#[StateType(WorkingOnTaskStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class WorkingOnTaskState extends AgentState
{
    private bool $isWorking = true;

    public function __construct(
        private readonly string $taskId,
        private readonly int $number,
        private readonly int $runNumber,
        private readonly TaskRecords $tasks,
        private readonly RunClaims $claims
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
        return new Some(Task::LINK_TYPE);
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
        $work = $this->workBy($input->hook->agentId);

        if (! $work->needsWork()) {
            $this->isWorking = false;

            return Decision::delegate();
        }

        return Decision::deny($work->unfinishedReason());
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

    // ----------[ Internals ]----------

    /**
     * The run as the agent sees it now: one read of the task and its run's claim.
     */
    private function workBy(string $agentId): TaskWork
    {
        $work = $this->tasks->get($this->taskId)->workFor($this->runNumber);
        $run = TaskRun::ofPairs([[$this->taskId, $this->runNumber]])->first();

        $isHeld = $run !== null && $this->claims->holderOf($run->assignmentIdentity())->filter(
            fn (ActorIdentity $holder) => $holder->isAgent() && $holder->id === $agentId,
        )->isDefined();

        return $isHeld ? $work : $work->unheld();
    }
}
