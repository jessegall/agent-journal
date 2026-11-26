<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Records\Contracts\CountResolver;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Enums\PlanStateGroup;
use Domain\Plans\Values\PlanFilters;

/**
 * How many plans are open: planned, started or paused, beside that navigation item; counted the way the list counts.
 */
final readonly class OpenPlansCount implements CountResolver
{
    public function __construct(private PlanResolver $records) {}

    public function count(): int
    {
        return $this->records->list(new PlanFilters(states: PlanStateGroup::Open->states()))->total;
    }
}
