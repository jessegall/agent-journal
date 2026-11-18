<?php

declare(strict_types=1);

namespace Domain\Tasks\Readers;

use App\Assignments\Contracts\AssigneeReader;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Contracts\TaskDetailsReader;
use Domain\Tasks\Contracts\TaskReader;
use Domain\Tasks\Enums\TaskView;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Readers\Support\TaskExecutions;

/**
 * Reads one visible task with its holder and its run; the brief, result note and reasons only in the context view.
 */
final readonly class TaskDetailRecords implements TaskDetailsReader
{
    public function __construct(
        private TaskReader $visibility,
        private AssigneeReader $assignees,
        private TaskExecutions $executions,
    ) {}

    public function details(string $taskId, TaskView $view): TaskDetails
    {
        $this->visibility->requireVisible($taskId);
        $task = Task::query()->whereKey($taskId)->sole();
        $holder = $this->assignees->holdersOfRecords([$task->assignmentIdentity()])->forRecord($task->assignmentIdentity());
        $execution = $this->executions->of($task->newCollection([$task]))[$task->id];

        return $task->details($holder, $execution, $view->includesText());
    }
}
