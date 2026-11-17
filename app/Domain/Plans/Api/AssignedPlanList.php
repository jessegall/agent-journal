<?php

declare(strict_types=1);

namespace App\Domain\Plans\Api;

use App\Core\Assignments\Support\NumberedPage;

/**
 * One page of the plans the calling agent holds, focused first then newest, and how many it holds that match.
 */
final readonly class AssignedPlanList
{
    /**
     * @param  list<PlanCard>  $cards
     */
    public function __construct(
        public array $cards,
        public NumberedPage $page,
        public int $total,
    ) {}
}
