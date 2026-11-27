<?php

declare(strict_types=1);

namespace App\Agents\Drivers\StartConditions;

use App\Processes\Contracts\Condition;
use App\Values\DriverStart;

/**
 * A start outside a container for which another condition holds, as every part a driver declares for local starts
 * applies only there.
 *
 * @implements Condition<DriverStart>
 */
final readonly class OutsideContainer implements Condition
{
    /**
     * @param  Condition<DriverStart>  $condition
     */
    public function __construct(private Condition $condition) {}

    /**
     * @param  DriverStart  $start
     */
    public function holdsFor(object $start): bool
    {
        return ! new ContainedStart()->holdsFor($start) && $this->condition->holdsFor($start);
    }
}
