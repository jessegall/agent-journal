<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use App\Assignments\Support\AssignmentHolder;
use Domain\Tasks\Enums\TaskState;
use PhpOption\Option;

/**
 * One task as its read gives it: number, title, state and revision, who holds it and who works on its run; in the
 * context view also its brief, result note and reasons, which the summary view leaves null.
 */
final readonly class TaskDetails
{
    /**
     * @param  Option<AssignmentHolder>  $holder
     */
    public function __construct(
        public string $id,
        public int $number,
        public string $title,
        public TaskState $state,
        public int $revision,
        public Option $holder,
        public TaskExecution|null $execution,
        public string|null $brief,
        public string|null $resultNote,
        public string|null $blockReason,
        public string|null $cancelReason,
    ) {}
}
