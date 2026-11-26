<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A start a connected machine runs on its owner's own terminal, from its sealed installation, signed in with the
 * sign-in that machine keeps for the project.
 *
 * @implements Condition<DriverStart>
 */
final readonly class OwnTerminalStart implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->executablePlace === ExecutablePlace::Sealed && $start->account === null;
    }
}
