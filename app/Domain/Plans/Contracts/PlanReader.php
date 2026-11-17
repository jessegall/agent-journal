<?php

declare(strict_types=1);

namespace App\Domain\Plans\Contracts;

use App\Domain\Plans\Api\PlanFilters;
use App\Domain\Plans\Api\PlanList;
use App\Domain\Plans\PlanRecords;
use Illuminate\Container\Attributes\Bind;

/**
 * One page of plan cards for whoever acts in this request, with the selected plan; every agent and the user read every
 * plan, but a read needs someone acting.
 */
#[Bind(PlanRecords::class)]
interface PlanReader
{
    public function list(PlanFilters $filters): PlanList;
}
