<?php

declare(strict_types=1);

namespace Tests\Fixtures\PublicContracts\Plans\Contracts;

use App\Hooks\Decisions\Decision;
use Tests\Fixtures\PublicContracts\Plans\Api\PlanData;

interface PlanReader
{
    public function get(int $planId): PlanData;

    public function decide(PlanData $plan): Decision;
}
