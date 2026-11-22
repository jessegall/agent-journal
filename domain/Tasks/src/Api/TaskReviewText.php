<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

/**
 * The text of a task as a review freezes it: its number, title, brief and the revision they belong to.
 */
final readonly class TaskReviewText
{
    public function __construct(
        public string $id,
        public int $number,
        public string $title,
        public string $brief,
        public int $revision,
    ) {}
}
