<?php

declare(strict_types=1);

namespace App\Domain\Plans\Api;

use App\Core\Assignments\Support\NumberedPage;
use App\Domain\Plans\Enums\PlanState;

/**
 * Which of the plans the calling agent holds to list: a title search, the states to keep (none means every state) and
 * the page.
 */
final readonly class AssignedPlanFilters
{
    /**
     * @param  list<PlanState>  $states
     */
    public function __construct(
        public string $search = '',
        public array $states = [],
        public NumberedPage $page = new NumberedPage,
    ) {}
}
