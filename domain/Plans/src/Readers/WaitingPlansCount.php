<?php

declare(strict_types=1);

namespace Domain\Plans\Readers;

use App\Ui\Contracts\CountReader;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Contracts\PlanReader;
use Domain\Plans\Enums\PlanStateGroup;

/**
 * How many plans are waiting for review, beside that navigation item; counted the way the list counts.
 */
final readonly class WaitingPlansCount implements CountReader
{
    public function __construct(private PlanReader $records) {}

    public function count(): int
    {
        return $this->records->list(new PlanFilters(states: PlanStateGroup::Waiting->states()))->total;
    }
}
