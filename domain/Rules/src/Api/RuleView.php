<?php

declare(strict_types=1);

namespace Domain\Rules\Api;

use Domain\Rules\Enums\RuleState;

/**
 * One rule as a page may show it: its number, its text, where it stands and whether it still waits for review.
 */
final readonly class RuleView
{
    public function __construct(
        public string $id,
        public string $text,
        public RuleState $state,
        public bool $canReview,
    ) {}
}
