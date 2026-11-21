<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Assignments\Support\AssignmentHolder;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Api\TaskText;
use Domain\Tasks\Models\Task;
use PhpOption\Option;

/**
 * How a task becomes the details and texts a read shows; kept out of the exported Data classes.
 */
final readonly class TaskReads
{
    /**
     * A task as a read shows it, without its long texts, with who holds it and how it runs.
     *
     * @param  Option<AssignmentHolder>  $holder
     */
    public static function details(Task $task, Option $holder, TaskExecution|null $execution): TaskDetails
    {
        return TaskDetails::from([
            'id' => $task->id,
            'number' => $task->number,
            'title' => $task->title,
            'state' => $task->state,
            'revision' => $task->revision,
            'holder' => $holder,
            'execution' => $execution,
        ]);
    }

    /**
     * A task's long texts.
     */
    public static function text(Task $task): TaskText
    {
        return TaskText::from([
            'brief' => $task->brief,
            'resultNote' => $task->result_note,
            'blockReason' => $task->block_reason,
            'cancelReason' => $task->cancel_reason,
        ]);
    }
}
