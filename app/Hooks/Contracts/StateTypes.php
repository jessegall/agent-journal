<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\States\Support\StateTypeRegistry;
use App\Hooks\Ticks\TickingTypes;

/**
 * What other Core areas use of the Hooks area's StateTypes.
 */
interface StateTypes
{
    /**
     * The guard that checks the work of a ticking state type is still live.
     */
    public function occurrenceGuardOf(string $typeKey): WorkOccurrenceGuard;

    public function registry(): StateTypeRegistry;

    public function ticking(): TickingTypes;
}
