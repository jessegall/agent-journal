<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A start that runs in its own container of the agent image.
 *
 * @implements Condition<DriverStart>
 */
final readonly class ContainedStart implements Condition
{
    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return $start->executablePlace === ExecutablePlace::Image;
    }
}
