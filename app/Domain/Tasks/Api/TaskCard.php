<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Api;

use App\Core\Assignments\Support\AssignmentHolder;
use App\Domain\Tasks\Enums\TaskState;

/**
 * One task as a list of held tasks shows it: the task, its state, and who holds it with the assignment reference.
 */
final readonly class TaskCard
{
    public function __construct(
        public int $id,
        public string $title,
        public TaskState $state,
        public AssignmentHolder $holder,
    ) {}
}
