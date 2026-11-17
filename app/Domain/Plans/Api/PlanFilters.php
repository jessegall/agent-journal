<?php

declare(strict_types=1);

namespace App\Domain\Plans\Api;

/**
 * Which plans to list: a title search, the page, and the plan selected for reading, if any. Web turns its validated
 * input into this; the domain owns what each filter means.
 */
final readonly class PlanFilters
{
    public function __construct(
        public string $search = '',
        public int $page = 1,
        public ?int $selectedPlanId = null,
    ) {}
}
