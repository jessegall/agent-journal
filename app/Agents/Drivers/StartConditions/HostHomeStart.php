<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A start on no saved account that runs with the host's own home and PATH; an owner's own terminal has a home of
 * its own.
 *
 * @implements Condition<DriverStart>
 */
final readonly class HostHomeStart implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->account === null && $start->executablePlace !== ExecutablePlace::Sealed;
    }
}
