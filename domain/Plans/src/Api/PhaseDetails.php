<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use Domain\Tasks\Api\TaskSummary;

/**
 * One phase as its read gives it: its plan, place, title and revision, and its tasks in order with their state.
 */
final readonly class PhaseDetails
{
    /**
     * @param  list<TaskSummary>  $tasks
     */
    public function __construct(
        public string $id,
        public string $planId,
        public int $number,
        public string $title,
        public int $revision,
        public array $tasks,
    ) {}
}
