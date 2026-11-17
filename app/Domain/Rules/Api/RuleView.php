<?php

declare(strict_types=1);

namespace App\Domain\Rules\Api;

/**
 * One rule as a page may show it: its number, its text, where it stands and whether it still waits for review.
 */
final readonly class RuleView
{
    public function __construct(
        public int $id,
        public string $text,
        public RuleState $state,
        public bool $canReview,
    ) {}
}
