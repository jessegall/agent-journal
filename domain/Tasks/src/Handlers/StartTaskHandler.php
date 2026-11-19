<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Desks\Contracts\ReplyInboxes;
use App\Desks\Contracts\RunClaims;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Resolves the session after every middleware, then starts the task for it under the task's row lock and answers the
 * run number: the same session's active run is kept, another session's run is not taken.
 */
final readonly class StartTaskHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private Dispatcher $events,
        private RunClaims $claims,
        private ReplyInboxes $replyInboxes,
    ) {}

    /**
     * Starts the run for whoever acts, a user or an agent alike, and claims it for them; another actor's standing
     * claim on a started task is not taken.
     *
     * @throws TaskRestartRefused
     * @throws TaskRunTaken
     */
    public function handle(StartTask $command, Task $task): int
    {
        $actor = ActorIdentity::of($this->actors->actor());
        $this->requireRunNotTaken($task, $actor);
        $task->startRun();
        $run = TaskRun::currentFor($task, $actor, $this->replyInboxes->replyInboxIdFor($actor));
        $this->claims->take($run->assignmentIdentity(), $task->assignmentIdentity(), $actor);
        $this->events->dispatch(new TaskStarted($command->taskId, $actor));

        return $task->run_number;
    }

    /**
     * @throws TaskRunTaken
     */
    private function requireRunNotTaken(Task $task, ActorIdentity $actor): void
    {
        $run = $task->state === TaskState::Started ? $task->currentRun() : null;
        $holder = $run === null ? null : $this->claims->holderOf($run->assignmentIdentity())->getOrElse(null);

        if ($holder !== null && ! $holder->isSameAs($actor)) {
            throw TaskRunTaken::forTask($task->number);
        }
    }
}
