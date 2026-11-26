<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use App\Support\AssignmentHolder;
use App\Values\ProjectOwner;
use Domain\Tasks\Enums\TaskStatus;
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
        public TaskStatus $state,
        public Option $holder,
        public TaskExecution|null $execution,
        public ProjectOwner $owner,
    ) {}
}
