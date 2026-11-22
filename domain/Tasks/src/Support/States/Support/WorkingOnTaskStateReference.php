<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\States\Support;

use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use Domain\Tasks\Models\Task;

/**
 * The stack reference of working on the current run of a task.
 */
final class WorkingOnTaskStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'tasks.working';

    public static function forTask(Task $task): StateReference
    {
        return self::about(new SubjectReference($task->id, $task->run_number));
    }
}
