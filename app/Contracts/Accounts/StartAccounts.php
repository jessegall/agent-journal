<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

use App\Data\Accounts\EligibleAccountsData;

/**
 * The accounts the current actor may choose for a start of one driver, read under the authority the start itself
 * needs, so whoever may not start one learns no account label; for a profile's start also the models it permits.
 */
interface StartAccounts
{
    /**
     * The accounts an agent of the driver may start with, and the one chosen by default.
     */
    public function forDriver(string $driver): EligibleAccountsData;

    /**
     * The accounts for a start of this driver from this profile, with the models the profile permits, its default
     * first.
     */
    public function forProfileStart(string $driver, string $profileKey): EligibleAccountsData;
}
