<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\StartTask;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Processes\RunClaims;
use App\Support\ActorIdentity;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Events\TaskRunClaimed;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Exceptions\TaskWaitsUnmet;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Values\TaskWaitLink;

/**
 * Resolves the session after every middleware, then starts the task for it under the task's row lock and answers the
 * run number: the same session's active run is kept, another session's run is not taken. The start's fact waits for
 * the run and claim work, and its transaction listeners run before the reply.
 */
final readonly class StartTaskHandler extends TaskCommandHandler
{
    public function __construct(
        private CommandFacts $facts,
        private RunClaims $claims,
        private TaskWaitResolver $waits,
    ) {}

    /**
     * Starts the run for whoever acts, a user or an agent alike, and claims it for them; another actor's standing
     * claim on a started task is not taken. A fresh start, of an open or a blocked task, waits until every task it
     * waits for is finished or waived; a repeat start of a started task keeps its run.
     *
     * @throws TaskRestartRefused
     * @throws TaskRunTaken
     * @throws TaskWaitsUnmet
     */
    public function handle(StartTaskCommand $command, Task $task): int
    {
        $actor = ActorIdentity::of($command->dispatchedBy());
        $this->requireRunNotTaken($task, $actor);

        if ($task->status !== TaskStatus::Started) {
            $this->assertWaitsMet($task);
        }

        $this->facts->holdUntilReturn(function () use ($task, $actor): void {
            $task->start($actor);
            $run = TaskRun::create($task, $actor);
            $claim = $this->claims->take($run->assignmentIdentity(), $task->assignmentIdentity(), $actor);

            $this->facts->publishAfterCommit(
                new TaskRunClaimed($task->id, $run->run_number, $actor, $claim->assignmentIds()),
            );
        });

        $this->facts->runTransactionListeners();

        return $task->run_number;
    }

    /**
     * @throws TaskWaitsUnmet
     */
    private function assertWaitsMet(Task $task): void
    {
        $unmet = array_values(array_filter(
            $this->waits->waitsOf($task->id)->waitsFor,
            fn (TaskWaitLink $link) => ! $link->isSatisfied,
        ));

        if ($unmet === []) {
            return;
        }

        throw TaskWaitsUnmet::forTask($task->number, array_map(
            fn (TaskWaitLink $link) => $link->number === null ? 'a removed task' : "task {$link->number}",
            $unmet,
        ));
    }

    /**
     * @throws TaskRunTaken
     */
    private function requireRunNotTaken(Task $task, ActorIdentity $actor): void
    {
        $run = $task->status === TaskStatus::Started ? $task->currentRun() : null;
        $holder = $run === null ? null : $this->claims->holderOf($run->assignmentIdentity())->getOrElse(null);

        if ($holder !== null && ! $holder->isSameAs($actor)) {
            throw TaskRunTaken::forTask($task);
        }
    }
}
