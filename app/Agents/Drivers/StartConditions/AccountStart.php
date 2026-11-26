<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Contracts\CommandLines\Condition;
use App\Values\DriverStart;

/**
 * A start on a saved account.
 *
 * @implements Condition<DriverStart>
 */
final readonly class AccountStart implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->account !== null;
    }
}
