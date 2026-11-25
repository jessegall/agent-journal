<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\AddTaskWait;

use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Support\TaskGraphLock;
use Domain\Tasks\Support\TaskWaitGraph;
use Domain\Tasks\Support\TaskWaitRules;

final readonly class AddTaskWaitHandler extends TaskCommandHandler
{
    public function __construct(
        private TaskResolver $tasks,
        private TaskGraphLock $lock,
        private TaskWaitGraph $graph,
        private TaskWaitRules $rules,
    ) {}

    /**
     * The new wait's id, after the graph lock and the two task locks; a self-link, an ended or started dependent, a
     * repeated wait and a wait that would close a cycle are refused.
     *
     * @throws TaskMissing
     * @throws TaskWaitRefused
     */
    public function handle(AddTaskWaitCommand $command): string
    {
        if ($command->dependentTaskId === $command->prerequisiteTaskId) {
            throw TaskWaitRefused::onItself(Task::findForId($command->dependentTaskId)->number);
        }

        $this->tasks->requireVisible($command->prerequisiteTaskId);
        [$dependent, $locked] = $this->lock->lock($command->dependentTaskId, $command->prerequisiteTaskId);
        $prerequisite = $this->rules->assertMayAdd($dependent, $locked, $command->prerequisiteTaskId);

        $this->graph->assertNoCycle($dependent, $prerequisite);
        $actor = $command->dispatchedBy();
        $wait = TaskWait::create($dependent, $prerequisite, $actor);
        TaskWaitHistory::create($wait, TaskWaitChange::Added, $actor, null, null);

        return $wait->id;
    }
}
