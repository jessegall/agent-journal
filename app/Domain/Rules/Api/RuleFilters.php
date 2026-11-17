<?php

declare(strict_types=1);

namespace App\Domain\Rules\Api;

/**
 * Which rules to list: a text search, the page, and the rule selected for reading, if any. Web turns its validated
 * input into this; the domain owns what each filter means.
 */
final readonly class RuleFilters
{
    public function __construct(
        public string $search = '',
        public int $page = 1,
        public ?int $selectedRuleId = null,
    ) {}
}
