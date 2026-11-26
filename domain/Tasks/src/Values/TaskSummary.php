<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskStatus;

/**
 * A task as a list shows it: its number and title.
 */
final readonly class TaskSummary
{
    public function __construct(
        public int $number,
        public string $title,
        public TaskStatus $status,
        public CarbonImmutable $changedAt,
    ) {}
}
