<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A terminal start on a saved account, which hands its status line on and heals by resuming.
 *
 * @implements Condition<DriverStart>
 */
final readonly class AccountTerminal implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->account !== null && ! $start->isTurn();
    }
}
