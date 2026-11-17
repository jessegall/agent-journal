<?php

declare(strict_types=1);

namespace App\Domain\Tasks\States\Support;

use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Domain\Tasks\Models\Task;

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
