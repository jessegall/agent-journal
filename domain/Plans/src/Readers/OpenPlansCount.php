<?php

declare(strict_types=1);

namespace Domain\Plans\Readers;

use App\Ui\Contracts\CountReader;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Contracts\PlanReader;
use Domain\Plans\Enums\PlanStateGroup;

/**
 * How many plans are open: planned, started or paused, beside that navigation item; counted the way the list counts.
 */
final readonly class OpenPlansCount implements CountReader
{
    public function __construct(private PlanReader $records) {}

    public function count(): int
    {
        return $this->records->list(new PlanFilters(states: PlanStateGroup::Open->states()))->total;
    }
}
