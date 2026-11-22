<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use Domain\Tasks\Enums\TaskState;

/**
 * The other task of one wait, as a task's waits list it: its id, number, title and state (none when it is gone),
 * whether the wait is met, and the waiver's reason when it was waived.
 */
final readonly class TaskWaitLink
{
    public function __construct(
        public string $taskId,
        public int|null $number,
        public string|null $title,
        public TaskState|null $state,
        public bool $isSatisfied,
        public string|null $waiveReason,
    ) {}
}
