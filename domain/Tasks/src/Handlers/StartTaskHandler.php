<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\SessionResolver;
use App\Contracts\CommandHandler;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Resolves the session after every middleware, then starts the task for it under the task's row lock and answers the
 * run number: the same session's active run is kept, another session's run is not taken.
 */
final readonly class StartTaskHandler implements CommandHandler
{
    public function __construct(
        private SessionResolver $sessions,
        private Dispatcher $events,
    ) {}

    /**
     * @throws TaskRestartRefused
     * @throws TaskRunTaken
     */
    public function handle(StartTask $command): int
    {
        $target = $this->sessions->requireActive($command->sessionId);
        $task = Task::lockedById($command->taskId);
        $task->startRun(new ActorIdentity(ActorType::Agent, $target->agentId));
        $this->events->dispatch(new TaskStarted($command->taskId, $target));

        return $task->run_number;
    }
}
