<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Assignments\Contracts\AssigneeResolver;
use App\Reads\Enums\ReadView;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\Support\TaskExecutions;

/**
 * Reads one visible task with its holder and its run; the brief, result note and reasons only in the context view.
 */
final readonly class TaskDetailRecords implements TaskDetailsResolver
{
    public function __construct(
        private TaskResolver $visibility,
        private AssigneeResolver $assignees,
        private TaskExecutions $executions,
    ) {}

    public function details(string $taskId, ReadView $view): TaskDetails
    {
        $this->visibility->requireVisible($taskId);
        $task = Task::query()->whereKey($taskId)->sole();
        $holder = $this->assignees->holdersOfRecords(
            [$task->assignmentIdentity()],
        )->forRecord($task->assignmentIdentity());
        $execution = $this->executions->of($task->newCollection([$task]))[$task->id];

        return $task->details($holder, $execution, $view->includesText());
    }
}
