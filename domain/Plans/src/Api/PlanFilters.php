<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use Domain\Plans\Enums\PlanState;

/**
 * Which plans to list: a title search, the page, and the plan selected for reading, if any. Web turns its validated
 * input into this; the domain owns what each filter means.
 */
final readonly class PlanFilters
{
    /**
     * @param  list<PlanState>  $states  only plans in these states, or every plan when empty
     */
    public function __construct(
        public string $search = '',
        public int $page = 1,
        public string|null $selectedPlanId = null,
        public array $states = [],
    ) {}
}
