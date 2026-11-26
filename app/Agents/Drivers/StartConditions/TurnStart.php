<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A start that runs one turn and ends.
 *
 * @implements Condition<DriverStart>
 */
final readonly class TurnStart implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->isTurn();
    }
}
