<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

/**
 * One phase as its read gives it: its plan, place, title and revision, and the references of its tasks in order;
 * their state is read from Tasks.
 */
final readonly class PhaseDetails
{
    /**
     * @param  list<string>  $taskIds
     */
    public function __construct(
        public string $id,
        public string $planId,
        public int $number,
        public string $title,
        public int $revision,
        public array $taskIds,
    ) {}
}
