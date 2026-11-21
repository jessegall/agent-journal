<?php

declare(strict_types=1);

namespace App\Hooks\StateCatalog\Contracts;

use App\Hooks\StateCatalog\StateTypeRegistry;
use App\Hooks\Ticks\TickingTypes;
use App\Hooks\Contracts\WorkOccurrenceGuard;

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
