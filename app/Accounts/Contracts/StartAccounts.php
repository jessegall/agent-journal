<?php

declare(strict_types=1);

namespace App\Accounts\Contracts;

use App\Accounts\Data\EligibleAccountsData;
use App\Values\ProfileBase;

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

    /**
     * The accounts and defaults for a built-in profile before or after its first activation.
     */
    public function forBuiltInStart(string $driver, ProfileBase $base): EligibleAccountsData;

    /**
     * The driver families at least one account of the journal can run; it names no account.
     *
     * @return list<string>
     */
    public function familiesWithAccounts(): array;

    /**
     * Whether any account of the journal is signed in; it names none.
     */
    public function hasSignedInAccount(): bool;
}
