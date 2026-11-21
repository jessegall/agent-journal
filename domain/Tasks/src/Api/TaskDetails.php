<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use Domain\Tasks\Models\Task;
use App\Assignments\Support\AssignmentHolder;
use Domain\Tasks\Enums\TaskState;
use PhpOption\Option;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * One task as its read gives it: number, title, state and revision, who holds it and who works on its run, and its
 * long texts when the read asks for them.
 */
final class TaskDetails extends Data
{
    /**
     * @param  Option<AssignmentHolder>  $holder
     */
    public function __construct(
        public readonly string $id,
        public readonly int $number,
        public readonly string $title,
        public readonly TaskState $state,
        public readonly int $revision,
        public readonly Option $holder,
        public readonly TaskExecution|null $execution,
        public readonly TaskText|Optional $text,
    ) {}

    /**
     * A task as a read shows it, without its long texts, with who holds it and how it runs.
     *
     * @param  Option<AssignmentHolder>  $holder
     */
    public static function fromTask(Task $task, Option $holder, TaskExecution|null $execution): self
    {
        return self::from([
            'id' => $task->id,
            'number' => $task->number,
            'title' => $task->title,
            'state' => $task->state,
            'revision' => $task->revision,
            'holder' => $holder,
            'execution' => $execution,
        ]);
    }
}
