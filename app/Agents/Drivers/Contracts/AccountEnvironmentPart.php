<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * A part of a driver's environment that applies only to a start on an account, handed that account.
 */
interface AccountEnvironmentPart
{
    /**
     * What the part adds to the environment of the start on the account.
     */
    public function __invoke(DriverStart $start, DriverAccount $account): EnvironmentAddition;
}
