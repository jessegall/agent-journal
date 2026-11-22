<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use App\Assignments\Support\AssignmentHolder;
use Domain\Tasks\Enums\TaskState;
use PhpOption\Option;

/**
 * One task as a task list shows it: the task and its display number, its state, who holds it with the assignment
 * reference, if anyone, and who works on its run, if anyone.
 */
final readonly class TaskCard
{
    /**
     * @param  Option<AssignmentHolder>  $holder
     */
    public function __construct(
        public string $id,
        public int $number,
        public string $title,
        public TaskState $state,
        public Option $holder,
        public TaskExecution|null $execution,
    ) {}
}
