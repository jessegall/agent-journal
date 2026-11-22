<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskState;

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
        public TaskState|null $state,
        public bool $isSatisfied,
        public string|null $waiveReason,
        public CarbonImmutable|null $waivedAt,
        public ActorIdentity|null $waivedBy,
    ) {}
}
