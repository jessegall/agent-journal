<?php

declare(strict_types=1);

namespace Tests\Fixtures\PublicContracts\Plans\Contracts;

use App\Support\Decisions\Decision;
use Tests\Fixtures\PublicContracts\Plans\Api\PlanData;

interface PlanResolver
{
    public function get(string $planId): PlanData;

    public function decide(PlanData $plan): Decision;
}
