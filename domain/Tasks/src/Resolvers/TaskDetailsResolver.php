<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Assignments\Contracts\AssigneeResolver;
use App\CommandRules\Enums\ReadView;
use Domain\Tasks\Contracts\TaskDetailsResolver as TaskDetailsResolverContract;
use Domain\Tasks\Contracts\TaskVisibility;
use Domain\Tasks\Data\TaskDetails;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\Support\TaskExecutionReader;

/**
 * Reads one visible task with its holder and its run; the brief, result note and reasons only in the context view.
 */
final readonly class TaskDetailsResolver implements TaskDetailsResolverContract
{
    public function __construct(
        private TaskVisibility $visibility,
        private AssigneeResolver $assignees,
        private TaskExecutionReader $executions,
    ) {}

    public function details(string $taskId, ReadView $view): TaskDetails
    {
        $this->visibility->requireVisible($taskId);
        $task = Task::query()->whereKey($taskId)->sole();

        $holder = $this->assignees->holdersOfRecords(
            [$task->assignmentIdentity()],
        )->forRecord($task->assignmentIdentity());

        $execution = $this->executions->of($task->newCollection([$task]))[$task->id];

        if ($view->includesText()) {
            return $task->detailsWithText($holder, $execution);
        }

        return $task->details($holder, $execution);
    }
}
