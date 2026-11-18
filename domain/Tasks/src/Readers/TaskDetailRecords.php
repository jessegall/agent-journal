<?php

declare(strict_types=1);

namespace Domain\Tasks\Readers;

use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentReader;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Contracts\TaskDetailsReader;
use Domain\Tasks\Contracts\TaskReader;
use Domain\Tasks\Enums\TaskView;
use Domain\Tasks\Models\Task;

/**
 * Reads one visible task with its holder and its run; the brief, result note and reasons only in the context view.
 */
final readonly class TaskDetailRecords implements TaskDetailsReader
{
    public function __construct(
        private TaskReader $visibility,
        private AssignmentReader $assignments,
        private AssigneeReader $assignees,
        private TaskExecutions $executions,
    ) {}

    public function details(string $taskId, TaskView $view): TaskDetails
    {
        $this->visibility->requireVisible($taskId);
        $task = Task::query()->whereKey($taskId)->sole();
        $holder = $this->assignees->holdersOf($this->assignments->assignmentsFor([$task->assignmentIdentity()]))->forRecord($task->assignmentIdentity());
        $text = $view->includesText();

        return new TaskDetails(
            $task->id,
            $task->number,
            $task->title,
            $task->state,
            $task->revision,
            $holder,
            $this->executions->of($task->newCollection([$task]))[$task->id],
            $text ? $task->brief : null,
            $text ? $task->result_note : null,
            $text ? $task->block_reason : null,
            $text ? $task->cancel_reason : null,
        );
    }
}
