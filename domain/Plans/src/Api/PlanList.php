<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

/**
 * One page of plan cards for the filters, the page it really is after normalizing, its size, and the selected plan.
 */
final readonly class PlanList
{
    /**
     * @param  list<PlanCard>  $cards
     */
    public function __construct(
        public array $cards,
        public PlanFilters $filters,
        public int $page,
        public int $perPage,
        public int $lastPage,
        public int $total,
        public PlanSelection $selection,
    ) {}
}
