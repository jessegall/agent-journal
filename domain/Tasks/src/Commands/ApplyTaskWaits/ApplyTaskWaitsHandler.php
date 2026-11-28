<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\ApplyTaskWaits;

use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Exceptions\TaskGraphChanged;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Support\TaskGraphLock;
use Domain\Tasks\Support\TaskGraphVersion;
use Domain\Tasks\Support\TaskWaitGraph;
use Domain\Tasks\Support\TaskWaitGuard;
use Domain\Tasks\Values\TaskWaitPair;

final readonly class ApplyTaskWaitsHandler extends TaskCommandHandler
{
    public function __construct(
        private TaskGraphLock $lock,
        private TaskGraphVersion $version,
        private TaskWaitGuard $rules,
        private TaskWaitGraph $graph,
    ) {}

    /**
     * The graph's new version, after every change was made under one batch; a graph changed since the base version, a
     * task the actor may not change, or any change a single wait change would refuse refuses the whole batch, and the
     * transaction leaves every wait as it was.
     *
     * @throws TaskGraphChanged
     * @throws TaskMissing
     * @throws TaskWaitRefused
     */
    public function handle(ApplyTaskWaitsCommand $command): string
    {
        $locked = $this->lock->lockAll([...$command->taskIds, ...$this->tasksNamed($command)]);

        if ($this->version->current($command->taskIds) !== $command->baseVersion) {
            throw TaskGraphChanged::since($command->baseVersion);
        }

        foreach ([
            ...$command->removed,
            ...$command->added,
        ] as $pair) {
            $dependent = $locked[$pair->dependentTaskId];

            if (! $this->rules->mayChange($dependent)) {
                throw TaskWaitRefused::notEditable($dependent->number);
            }
        }

        $removed = array_map(
            fn (TaskWaitPair $pair) => $this->rules->existingToRemove(
                $locked[$pair->dependentTaskId],
                $pair->prerequisiteTaskId,
            ),
            $command->removed,
        );

        $actor = $command->dispatchedBy();
        $batchId = (string) str()->ulid();

        foreach ($removed as $wait) {
            TaskWaitHistory::create($wait, TaskWaitChange::Removed, $actor, null, $batchId);
            $wait->remove();
        }

        // Each add is checked against the graph as the earlier changes of this batch left it.
        foreach ($command->added as $pair) {
            $dependent = $locked[$pair->dependentTaskId];

            $prerequisite = $this->rules->assertMayAdd(
                $dependent,
                $locked[$pair->prerequisiteTaskId] ?? null,
                $pair->prerequisiteTaskId,
            );

            $this->graph->assertNoCycle($dependent, $prerequisite);
            $wait = TaskWait::create($dependent, $prerequisite, $actor);
            TaskWaitHistory::create($wait, TaskWaitChange::Added, $actor, null, $batchId);
        }

        return $this->version->current($command->taskIds);
    }

    /**
     * Every task a change names, so each is locked with the plan's tasks.
     *
     * @return list<string>
     */
    private function tasksNamed(ApplyTaskWaitsCommand $command): array
    {
        return array_merge(...array_map(
            fn (TaskWaitPair $pair) => [
                $pair->dependentTaskId,
                $pair->prerequisiteTaskId,
            ],
            [...$command->removed, ...$command->added],
        ));
    }
}
