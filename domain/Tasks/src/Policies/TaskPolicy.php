<?php

declare(strict_types=1);

namespace Domain\Tasks\Policies;

use App\Access\Contracts\Policy;
use Domain\Tasks\Models\Task;

/**
 * Task authoring: creating tasks and changing their text, decided by the grant alone; the run is TaskRunPolicy's.
 */
final readonly class TaskPolicy implements Policy
{
    public static function model(): string
    {
        return Task::class;
    }
}
