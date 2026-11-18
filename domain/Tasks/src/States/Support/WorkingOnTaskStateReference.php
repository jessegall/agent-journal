<?php

declare(strict_types=1);

namespace Domain\Tasks\States\Support;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use Domain\Tasks\Models\Task;

/**
 * The stack reference of working on the current run of a task.
 */
final class WorkingOnTaskStateReference
{
    public const string TYPE_KEY = 'tasks.working';

    public static function forTask(Task $task): StateReference
    {
        return new StateReference(self::TYPE_KEY, new SubjectReference($task->id, $task->run_number));
    }
}
