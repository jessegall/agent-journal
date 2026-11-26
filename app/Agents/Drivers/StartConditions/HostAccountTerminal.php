<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A terminal on a saved account that runs on its host, where a side socket of the host can take its status line; a
 * contained one has none.
 *
 * @implements Condition<DriverStart>
 */
final readonly class HostAccountTerminal implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->account !== null && ! $start->isTurn() && $start->executablePlace !== ExecutablePlace::Image;
    }
}
