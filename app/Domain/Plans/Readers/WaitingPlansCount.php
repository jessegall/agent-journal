<?php

declare(strict_types=1);

namespace App\Domain\Plans\Readers;

use App\Core\Ui\Contracts\CountReader;
use App\Domain\Plans\Api\PlanFilters;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Enums\PlanStateGroup;

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
