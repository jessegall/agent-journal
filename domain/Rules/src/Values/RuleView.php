<?php

declare(strict_types=1);

namespace Domain\Rules\Values;

use Domain\Rules\Enums\RuleStatus;

/**
 * One rule as a page may show it: its number, its text, where it stands and whether it still waits for review.
 */
final readonly class RuleView
{
    public function __construct(
        public string $id,
        public int $number,
        public string $text,
        public RuleStatus $status,
        public bool $canReview,
    ) {}
}
