<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use Domain\Tasks\Models\Task;

/**
 * The name links and assignments give a task, for a domain that names tasks without reading the Task model.
 */
final class TaskType
{
    /**
     * The task's link type, its alias in the morph map.
     */
    public static function linkType(): string
    {
        return Task::linkType();
    }
}
