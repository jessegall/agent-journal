<?php

declare(strict_types=1);

namespace Domain\Plans\Values;

use App\Support\NumberedPage;
use Domain\Plans\Enums\PlanStatus;

/**
 * Which of the plans the calling agent holds to list: a title search, the states to keep (none means every state) and
 * the page.
 */
final readonly class AssignedPlanFilters
{
    /**
     * @param  list<PlanStatus>  $states
     */
    public function __construct(
        public string $search = '',
        public array $states = [],
        public NumberedPage $page = new NumberedPage(),
    ) {}
}
