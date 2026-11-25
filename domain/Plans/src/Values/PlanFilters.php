<?php

declare(strict_types=1);

namespace Domain\Plans\Values;

use Domain\Plans\Enums\PlanStatus;

/**
 * Which plans to list: a title search, the page, and the plan selected for reading, if any. Web turns its validated
 * input into this; the domain owns what each filter means.
 */
final readonly class PlanFilters
{
    public const int PAGE_SIZE = 20;

    /**
     * @param  list<PlanStatus>  $states  only plans in these states, or every plan when empty
     */
    public function __construct(
        public string $search = '',
        public int $page = 1,
        public string|null $selectedPlanId = null,
        public array $states = [],
        public int|null $selectedPlanNumber = null,
        public int $perPage = self::PAGE_SIZE,
    ) {}
}
