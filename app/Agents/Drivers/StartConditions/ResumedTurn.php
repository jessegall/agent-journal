<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A turn that resumes its conversation.
 *
 * @implements Condition<DriverStart>
 */
final readonly class ResumedTurn implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->isResume && $start->isTurn();
    }
}
