<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Drivers\Enums\HookDriver;
use App\Http\Data\Profiles\EligibleAccountsData;

/**
 * The accounts the current actor may choose for a start of one driver, read under the authority the start itself
 * needs, so whoever may not start one learns no account label.
 */
interface StartAccounts
{
    public function forDriver(HookDriver $driver): EligibleAccountsData;
}
