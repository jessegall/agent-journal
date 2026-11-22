<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Tasks\Commands\AddTaskWait;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Handlers\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Support\TaskGraphLock;
use Domain\Tasks\Support\TaskWaitGraph;

final readonly class AddTaskWaitHandler extends TaskCommandHandler
{
    public function __construct(
        private TaskResolver $tasks,
        private TaskGraphLock $lock,
        private TaskWaitGraph $graph,
    ) {}

    /**
     * The new wait's id, after the graph lock and the two task locks; a self-link, an ended or started dependent, a
     * repeated wait and a wait that would close a cycle are refused.
     *
     * @throws TaskMissing
     * @throws TaskWaitRefused
     */
    public function handle(AddTaskWait $command): string
    {
        if ($command->dependentTaskId === $command->prerequisiteTaskId) {
            throw TaskWaitRefused::onItself(Task::ofId($command->dependentTaskId)->number);
        }

        $this->tasks->requireVisible($command->prerequisiteTaskId);
        [$dependent, $prerequisite] = $this->lock->lock($command->dependentTaskId, $command->prerequisiteTaskId);

        if ($prerequisite === null) {
            throw TaskMissing::forId($command->prerequisiteTaskId);
        }

        if ($dependent->state->hasEnded()) {
            throw TaskWaitRefused::dependentEnded($dependent->number, $dependent->state->value);
        }

        if ($dependent->state === TaskState::Started) {
            throw TaskWaitRefused::dependentStarted($dependent->number);
        }

        if (TaskWait::between($dependent->id, $prerequisite->id) !== null) {
            throw TaskWaitRefused::alreadyWaits($dependent->number, $prerequisite->number);
        }

        $this->graph->assertNoCycle($dependent, $prerequisite);
        $actor = ActorIdentity::of($command->dispatchedBy());
        $wait = TaskWait::create($dependent, $prerequisite, $actor);
        TaskWaitHistory::create($wait, TaskWaitChange::Added, $actor, null);

        return $wait->id;
    }
}
