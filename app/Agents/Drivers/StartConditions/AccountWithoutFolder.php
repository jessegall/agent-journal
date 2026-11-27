<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A start on a saved account whose folder on the host is not known.
 *
 * @implements Condition<DriverStart>
 */
final readonly class AccountWithoutFolder implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->executablePlace !== ExecutablePlace::Image
            && $start->account !== null
            && $start->account->folder === null;
    }
}
