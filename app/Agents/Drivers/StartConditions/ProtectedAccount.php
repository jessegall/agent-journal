<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Contracts\CommandLines\Condition;
use App\Values\DriverStart;

/**
 * A start on a protected account, whose sign-in its container keeps from the tools.
 *
 * @implements Condition<DriverStart>
 */
final readonly class ProtectedAccount implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->account?->isProtected === true;
    }
}
