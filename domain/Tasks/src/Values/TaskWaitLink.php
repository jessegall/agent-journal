<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskStatus;

/**
 * The other task of one wait, as a task's waits list it: its id, number, title and state (none when it is gone),
 * whether the wait is met, and who waived it, when and why when it was waived.
 */
final readonly class TaskWaitLink
{
    public function __construct(
        public string $taskId,
        public int|null $number,
        public string|null $title,
        public TaskStatus|null $status,
        public bool $isSatisfied,
        public string|null $waiveReason,
        public CarbonImmutable|null $waivedAt,
        public ActorReference|null $waivedBy,
    ) {}
}
