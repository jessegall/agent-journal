<?php

declare(strict_types=1);

namespace App\Support\StateCatalog\Contracts;

use App\Contracts\Work\WorkOccurrenceGuard;
use App\Support\StateCatalog\StateRegistration;
use App\Support\Ticks\TickingTypes;

/**
 * What other Core areas use of the Hooks area's StateTypes.
 */
interface StateTypes
{
    /**
     * The guard that checks the work of a ticking state type is still live.
     */
    public function occurrenceGuardOf(string $typeKey): WorkOccurrenceGuard;

    /**
     * Every registered state type, by its key.
     */
    public function registry(): StateRegistration;

    /**
     * The state types that hear the engine's tick.
     */
    public function ticking(): TickingTypes;
}
