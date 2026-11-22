<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Data\Profiles\EligibleAccountsData;

/**
 * The accounts the current actor may choose for a start of one driver, read under the authority the start itself
 * needs, so whoever may not start one learns no account label; for a profile's start also the models it permits.
 */
interface StartAccounts
{
    public function forDriver(string $driver): EligibleAccountsData;

    /**
     * The accounts for a start of this driver from this profile, with the models the profile permits, its default
     * first.
     */
    public function forProfileStart(string $driver, string $profileKey): EligibleAccountsData;
}
