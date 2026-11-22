<?php

declare(strict_types=1);

namespace Domain\Rules\Values;

use Domain\Rules\Enums\RuleState;

/**
 * Which rules to list: a text search, the page, and the rule selected for reading, if any. Web turns its validated
 * input into this; the domain owns what each filter means.
 */
final readonly class RuleFilters
{
    public const int PAGE_SIZE = 30;

    public function __construct(
        public string $search = '',
        public int $page = 1,
        public string|null $selectedRuleId = null,
        public RuleState|null $state = null,
        public int $perPage = self::PAGE_SIZE,
    ) {}
}
