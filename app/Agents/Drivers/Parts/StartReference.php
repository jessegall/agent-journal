<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Parts;

use App\Agents\Drivers\Contracts\AccountEnvironmentPart;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * The reference an account start reaches the journal by.
 */
final readonly class StartReference implements AccountEnvironmentPart
{
    /**
     * JOURNAL_START_REF for the account's start.
     */
    public function __invoke(DriverStart $start, DriverAccount $account): EnvironmentAddition
    {
        return new EnvironmentAddition(['JOURNAL_START_REF='.$account->startReference]);
    }
}
