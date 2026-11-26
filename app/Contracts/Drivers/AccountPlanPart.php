<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\PlanAddition;

/**
 * A part of a driver's start plan that applies only to a start on an account, handed that account.
 */
interface AccountPlanPart
{
    /**
     * What the part adds to the plan of the start on the account.
     */
    public function __invoke(DriverStart $start, DriverAccount $account): PlanAddition;
}
