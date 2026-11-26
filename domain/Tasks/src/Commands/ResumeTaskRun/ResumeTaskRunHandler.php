<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\ResumeTaskRun;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Processes\RunClaims;
use App\Contracts\Work\AgentStacks;
use App\Contracts\Work\CurrentState;
use App\Exceptions\RunClaimRefused;
use App\Support\References\SubjectReference;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Events\TaskRunClaimed;
use Domain\Tasks\Exceptions\TaskResumeCovered;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Domain\Tasks\Exceptions\TaskRunStale;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Support\States\Support\WorkOnTaskStateReference;

final readonly class ResumeTaskRunHandler extends TaskCommandHandler
{
    public function __construct(
        private RunClaims $claims,
        private AgentStacks $stacks,
        private CurrentState $states,
        private CommandFacts $facts,
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
    public function handle(ResumeTaskRunCommand $command, Task $task): int
    {
        $run = TaskRun::ownForUpdate($command->runId);

        if ($run->isFinished()) {
            throw TaskRunFinished::forRun($run->id);
        }

        if ($task->status !== TaskStatus::Started || ! $task->isCurrentRun($run->run_number)) {
            throw TaskRunStale::forRun($task->number, $run->run_number);
        }

        $this->assertNotCovered($task);

        $actor = $command->dispatchedBy();
        $claim = $this->claims->take($run->assignmentIdentity(), $task->assignmentIdentity(), $actor);

        $this->stacks->activateForCaller(WorkOnTaskStateReference::forTask($task));

        $this->facts->publishAfterCommit(
            new TaskRunClaimed($task->id, $run->run_number, $actor, $claim->assignmentIds()),
        );

        return $run->run_number;
    }

    /**
     * @throws TaskResumeCovered
     */
    private function assertNotCovered(Task $task): void
    {
        foreach ($this->states->ofCaller(WorkOnTaskStateReference::class) as $current) {
            $subject = $current->subject;

            if ($subject instanceof SubjectReference && $subject->id !== $task->id) {
                throw TaskResumeCovered::by(Task::resolveNumberOf($subject->id), $task->number);
            }
        }
    }
}
