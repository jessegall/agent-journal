<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Contracts\CommandLines\Condition;
use App\Values\DriverStart;

/**
 * A terminal start that resumes its conversation.
 *
 * @implements Condition<DriverStart>
 */
final readonly class ResumedTerminal implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->isResume && ! $start->isTurn();
    }
}
