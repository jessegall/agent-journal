<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

/**
 * One phase of a plan in a plan read: its place, title and revision, and the references of its tasks in that read's
 * window, in order.
 */
final readonly class PlanPhaseTasks
{
    /**
     * @param  list<string>  $taskIds
     */
    public function __construct(
        public string $id,
        public int $number,
        public string $title,
        public int $revision,
        public array $taskIds,
    ) {}
}
