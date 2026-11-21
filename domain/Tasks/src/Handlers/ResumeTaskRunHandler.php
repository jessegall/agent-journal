<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Desks\Contracts\RunClaims;
use App\Desks\Exceptions\RunClaimRefused;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\References\SubjectReference;
use Domain\Tasks\Commands\ResumeTaskRun;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskResumeCovered;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Domain\Tasks\Exceptions\TaskRunStale;
use Domain\Tasks\Handlers\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\States\Support\WorkingOnTaskStateReference;

final readonly class ResumeTaskRunHandler extends TaskCommandHandler
{
    public function __construct(
        private RunClaims $claims,
        private ActorWorkStacks $workStack,
    ) {}

    /**
     * Claims the task's current started run for the actor through the task's current holder and puts that exact run
     * on the stacks of the actor's admitted sessions; the run keeps its number. Another task that is current on the
     * stack refuses it before anything changes.
     *
     * @throws TaskRunFinished
     * @throws TaskRunStale
     * @throws TaskResumeCovered
     * @throws RunClaimRefused
     */
    public function handle(ResumeTaskRun $command, Task $task): int
    {
        $run = TaskRun::lockedById($command->runId);

        if ($run->isFinished()) {
            throw TaskRunFinished::forRun($run->id);
        }

        if ($task->state !== TaskState::Started || ! $task->isCurrentRun($run->run_number)) {
            throw TaskRunStale::forRun($task->number, $run->run_number);
        }

        $this->assertNotCovered($task);

        $this->claims->take(
            $run->assignmentIdentity(),
            $task->assignmentIdentity(),
            ActorIdentity::of($command->dispatchedBy()),
        );

        $this->workStack->push(WorkingOnTaskStateReference::forTask($task));

        return $run->run_number;
    }

    /**
     * @throws TaskResumeCovered
     */
    private function assertNotCovered(Task $task): void
    {
        foreach ($this->workStack->current(WorkingOnTaskStateReference::TYPE_KEY) as $current) {
            $subject = $current->subject;

            if ($subject instanceof SubjectReference && $subject->id !== $task->id) {
                throw TaskResumeCovered::by(Task::numberOf($subject->id), $task->number);
            }
        }
    }
}
