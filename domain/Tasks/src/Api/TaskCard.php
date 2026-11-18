<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use App\Assignments\Support\AssignmentHolder;
use Domain\Tasks\Enums\TaskState;

/**
 * One task as a list of held tasks shows it: the task, its state, and who holds it with the assignment reference.
 */
final readonly class TaskCard
{
    public function __construct(
        public string $id,
        public string $title,
        public TaskState $state,
        public AssignmentHolder $holder,
    ) {}
}
